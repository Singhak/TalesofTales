import { configuration } from './../configuration';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Post } from './post-service.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  home = configuration.home;
  constructor(private firestore: AngularFirestore) { }

  private posts: Post[] = [];
  postSubscription = new BehaviorSubject<Post[]>(null);


  // Models for Input fields
  nameValue: string;
  placeValue: string;

  // tslint:disable: variable-name
  // Data object for listing items
  tableData: any[] = [];

  // Save first document in snapshot of items received
  firstInResponse: any = [];

  // Save last document in snapshot of items received
  lastInResponse: any = [];

  // Keep the array of first document of previous pages
  prev_strt_at: any = [];

  // Maintain the count of clicks on Next Prev button
  pagination_clicked_count = 0;

  // Disable next and prev buttons
  disable_next = false;
  disable_prev = false;

  getPosts() {
    this.firestore.collection('Posts', ref => ref
      .limit(5)
      .orderBy('postDate', 'desc'))
      .snapshotChanges().subscribe((res) => {
        this.posts = res.map((rawPost) => {
          const post = rawPost.payload.doc.data() as Post;
          return this.postObject(post, rawPost.payload.doc.id);
        });
        this.postSubscription.next(this.posts);
      });
  }

  imgCreator(type: string, ImgOwner: string) {
    if (ImgOwner) {
      const img = ImgOwner.split('/');
      if (type === 'owner') {
        return img[0].trim();
      }
      if (type === 'contentId') {
        return img[1].trim();
      }
    }
    return '';
  }

  private getAuthorProfile(uid:string) {
    return "/profile/"+uid+"/posts";
  }

  getPost(id: string) {
    let post: any;
    if (this.posts.length) {
      post = this.posts.filter((e) => e.id === id)[0];
    }
    if (!post) {
      return this.getPostById(id, 'Posts')
    } else {
      return post;
    }
  }

  getPostById(id: string, collection: string) {

    // return this.firestore.collection(collection).doc(id).get();
    return this.firestore.collection(collection).doc(id).snapshotChanges().pipe(
      take(1),
      map((rawdata) => {
        let post = rawdata.payload.data() as Post;
        return this.postObject(post, id);
      })
    );
  }

  getPostOfUser(uid: string, collection: string) {
    return this.firestore.collection(collection, ref => ref
      .limit(5)
      .orderBy('postDate', 'desc')
      .where("uid", "==", uid))
      .snapshotChanges().pipe(
        map((rawdatas) => {
          return rawdatas.map((rawdata) => {
            let id = rawdata.payload.doc.id;
            return { id, ...rawdata.payload.doc.data() }
          })
        })
      )
  }

  deletePost(id:string, collection:string){
    return this.firestore.collection(collection).doc(id).delete();
  }

  saveAs(data: Post, id: string, collection: string) {
    if (id) {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection(collection)
          .doc(id)
          .set(data, { merge: true })
          .then(res => { resolve(res) }, err => reject(err));
      });
    } else
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection(collection)
          .add(data)
          .then(res => { resolve(res) }, err => reject(err));
      });
  }

  loadPosts() {
    this.firestore.collection('Posts', ref => ref
      .limit(5)
      .orderBy('postDate', 'desc')
    ).snapshotChanges()
      .subscribe(response => {
        if (!response.length) {
          console.log('No Data Available');
          return false;
        }
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.posts = response.map((rawPost) => {
          const post = rawPost.payload.doc.data() as Post;
          return this.postObject(post, rawPost.payload.doc.id);
        });
        this.postSubscription.next(this.posts.slice());
        // Initialize values
        this.prev_strt_at = [];
        this.pagination_clicked_count = 0;
        this.disable_next = false;
        this.disable_prev = false;
        // Push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
      }, error => {
      });
  }


  // Show previous set
  prevPage() {
    this.disable_prev = true;
    this.firestore.collection('Posts', ref => ref
      .orderBy('postDate', 'desc')
      .startAt(this.get_prev_startAt())
      .endBefore(this.firstInResponse)
      .limit(5)
    ).get()
      .subscribe(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];

        this.posts = response.docs.map((rawPost) => {
          const post = rawPost.data() as Post;
          return this.postObject(post, rawPost.id);
        });
        // Maintaing page no.
        this.pagination_clicked_count--;
        // Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);
        // Enable buttons again
        this.disable_prev = false;
        this.disable_next = false;
        this.postSubscription.next(this.posts.slice());
      }, error => {
        this.disable_prev = false;
      });
  }

  nextPage() {
    this.disable_next = true;
    this.firestore.collection('Posts', ref => ref
      .limit(5)
      .orderBy('postDate', 'desc')
      .startAfter(this.lastInResponse)
    ).get()
      .subscribe(response => {

        if (!response.docs.length) {
          this.disable_next = true;
          this.postSubscription.next([]);
          return;
        }

        this.firstInResponse = response.docs[0];

        this.lastInResponse = response.docs[response.docs.length - 1];
        this.posts = response.docs.map((rawPost) => {
          const post = rawPost.data() as Post;
          return this.postObject(post, rawPost.id);
        });
        this.pagination_clicked_count++;
        this.push_prev_startAt(this.firstInResponse);
        this.disable_next = false;
        this.postSubscription.next(this.posts.slice());
      }, error => {
        this.disable_next = false;
      });
  }

  // Add document
  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }

  // Remove not required document
  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id === element.data().id) {
        element = null;
      }
    });
  }

  // Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1)) {
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    }
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }

  postObject(post: Post, id: string): Post {
    return {
      id: id,
      content: post.content,
      subtitle: post.subtitle,
      postDate: post.postDate,
      title: post.title,
      author: post.author,
      category: post.category,
      imgPath: post.imgPath ? post.imgPath : this.home.img,
      social: this.getAuthorProfile(post.uid),
      imgOwner: this.imgCreator('owner', post.imgOwner),
      imgId: this.imgCreator('contentId', post.imgOwner),
      uid: post.uid
    };
  }

}

export interface Post {
  id?: string;
  title: string;
  subtitle?: string;
  postDate: string;
  category?: string;
  content: string;
  imgPath?: string;
  author?: string;
  social?: string;
  imgOwner?: string;
  imgId?: string;
  uid: string;
}
