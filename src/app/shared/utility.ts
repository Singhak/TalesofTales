export class UtilityFun {

    static minute_to_read(content: string, category?: string) {
        const POEM_AVG = 130;
        const ARTICLE_AVG = 200;
        let num = 0;
        let wordCount = 0;
        content = content.replace(/<br>/g, '');
        content = content.replace(/<p>/g, '');
        content = content.replace(/>/g, '');
        const wordList = content.split(' ');
        const filterList = wordList.filter(Boolean);
        wordCount = filterList.length;
        if (category && category.toLocaleLowerCase() === 'poem') {
            num = wordCount / POEM_AVG;
        } else {
            num = wordCount / ARTICLE_AVG;
        }
        const min = Math.round(num);
        const sec = (num % 1).toFixed(2).substring(2);
        return `${min === 0 ? sec : min} ${min === 0 ? 'sec' : 'min'} read`;
    }

    static remove_markeddown(content: string): string {
        content = content.replace(/<br>/g, '');
        content = content.replace(/<p>/g, '');
        content = content.replace(/>/g, '');
        return content;
    }

    static getImgOwnerName(imgOwner: string) {
        return imgOwner.substr(0, imgOwner.lastIndexOf('-')).trim();
    }

    static isInternetConnected(): boolean {
        return navigator.onLine;
    }

    static ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    static fireStoreCode(code: String) {
        switch (code) {
            case "unauthenticated":
                return "You have not valid authentication credentials for the operation";
            case "permission-denied":
                return "You have not permission to execute/see the specified operation/data";
            case "already-exists":
                return "Some document that we attempted to create already exists";
            case "not-found":
                return "Some requested document was not found.";
            case "aborted":
                return "The operation was aborted";
            default:
                return "Something has gone wrong";
        }
    }

    static trimContent(content: string, len: number) {
        content = UtilityFun.remove_markeddown(content)
        content =content.replace(/(\r\n|\n|\r)/gm, " ");;
        const wordList = content.split(' ');
        const filterList = wordList.filter(Boolean);
        return filterList.slice(0, len).join(' ').trim() + '...';
    }
}
