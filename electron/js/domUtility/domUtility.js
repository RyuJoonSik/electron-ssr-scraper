export function 특정_요소이면(타겟_요소, 비교_요소들) {
    return 비교_요소들.some((요소) => 타겟_요소 instanceof 요소);
}
export function 옵션_배열_생성(사전, 태그_속성) {
    const 공통_속성 = 태그_속성_나열(태그_속성);
    const 옵션_태그_배열 = Object.entries(사전).map(([단어, 뜻]) => `<option ${공통_속성} value="${뜻}">${단어}</option>`);
    return 옵션_태그_배열;
}
export function 태그_속성_나열(태그_속성) {
    const 공통_속성 = Object.entries(태그_속성)
        .reduce((문자열, [속성, 값]) => {
        문자열 += `${속성}="${값}" `;
        return 문자열;
    }, '')
        .trimEnd();
    return 공통_속성;
}
export function 옵션_선택(옵션_요소) {
    옵션_요소.selected = true;
}
export function 요소_값_반환(요소) {
    return 요소.value;
}
export function 요소_찾기(부모, 셀렉터) {
    const 요소 = 부모.querySelector(셀렉터);
    return 요소;
}
export function 인풋_커서_위치_초기화(인풋_요소) {
    const { value: 문자열 } = 인풋_요소;
    const 문자열_길이 = 문자열.length;
    인풋_요소.selectionStart = 인풋_요소.selectionEnd = 문자열_길이;
}
export async function DOM_생성(URL) {
    const HTML_텍스트 = await 페이지_요청(URL);
    const DOM = DOM_변환(HTML_텍스트);
    return DOM;
}
export async function 페이지_요청(URL) {
    const 응답 = await fetch(URL);
    const HTML_텍스트 = await 응답.text();
    // if (!응답.ok) {
    //   throw new Error();
    // }
    return HTML_텍스트;
}
export function DOM_변환(HTML_텍스트) {
    const DOM_파서 = new DOMParser();
    const DOM = DOM_파서.parseFromString(HTML_텍스트, 'text/html');
    return DOM;
}
export function 마지막_페이지_번호_탐색(DOM, 선택자 = '.pagination-link') {
    const 페이지_번호_리스트 = 요소_리스트_찾기(DOM, 선택자);
    const 길이 = 리스트_길이_추출(페이지_번호_리스트);
    const 마지막_인덱스 = 길이 - 1;
    const 마지막_페이지_번호 = 페이지_번호_리스트[마지막_인덱스];
    const 마지막_페이지_번호_텍스트 = 텍스트_컨텐츠_추출(마지막_페이지_번호);
    return Number(마지막_페이지_번호_텍스트);
}
export function 요소_리스트_찾기(부모, 선택자) {
    const 요소_리스트 = 부모.querySelectorAll(선택자);
    return 요소_리스트;
}
export function 리스트_길이_추출(리스트) {
    const 길이 = 리스트.length;
    return 길이;
}
export function 텍스트_컨텐츠_추출(요소) {
    const 텍스트 = 요소.textContent?.trim();
    return 텍스트;
}
export function 쿼리_스트링이_있다면(검색_URL) {
    const 결과 = 검색_URL.includes('?');
    return 결과;
}
export function 페이지_번호_배열_생성(시작_페이지_번호, 끝_페이지_번호) {
    const 페이지_수 = 끝_페이지_번호 - 시작_페이지_번호 + 1;
    const 페이지_번호_배열 = Array.from({ length: 페이지_수 }, (_, 인덱스) => 인덱스 + 시작_페이지_번호);
    return 페이지_번호_배열;
}
export function 페이지_제품_URL_배열_탐색(페이지, 선택자 = '.absolute-link.product-link') {
    const 링크_리스트 = 요소_리스트_찾기(페이지, 선택자);
    const 링크_배열 = [...링크_리스트];
    return 링크_배열.map(({ href }) => href);
}
export async function URL_배열_DOM_파싱(URL_배열) {
    const DOM_배열 = [];
    for await (let URL of URL_배열) {
        const DOM = await DOM_생성(URL);
        DOM_배열.push(DOM);
    }
    return DOM_배열;
}
export function 제품_URL_탐색(페이지, 선택자 = '.ga-product.product-grouping-refresh') {
    const 요소 = 요소_찾기(페이지, 선택자);
    const URL = 요소.getAttribute('itemid');
    return URL;
}
export function 제품_이름_탐색(페이지, 선택자 = '#name') {
    const 요소 = 요소_찾기(페이지, 선택자);
    const 이름 = 텍스트_컨텐츠_추출(요소);
    return 이름;
}
export function 제품_이미지_URL_배열_탐색(페이지, 선택자 = '.lazy.img-responsive') {
    const 이미지_리스트 = 요소_리스트_찾기(페이지, 선택자);
    const 이미지_배열 = [...이미지_리스트];
    const 이미지_URL_배열 = 이미지_배열.map(({ dataset: { lazyload } }) => lazyload);
    return 이미지_URL_배열;
}
export function 제품_후기_탐색(페이지, 선택자 = '#product-summary-header .stars') {
    const 요소 = 요소_찾기(페이지, 선택자);
    const { title: 후기 } = 요소;
    const [별점, 후기_수] = 후기.split(' - ');
    return [별점, 후기_수];
}
