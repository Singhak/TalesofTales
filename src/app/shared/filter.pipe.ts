import { UtilityFun } from './utility';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trimText'
})
export class TrimTextPipe implements PipeTransform {

    transform(content: string, len?: number) {
        // const plainText = remove_markdown__WEBPACK_IMPORTED_MODULE_2__(content) as string;
        len = len ? len : 35;
        return UtilityFun.trimContent(content, len)
        // const wordList = content.split(' ');
        // const filterList = wordList.filter(Boolean);
        // return filterList.slice(0, len).join(' ');
    }
}
