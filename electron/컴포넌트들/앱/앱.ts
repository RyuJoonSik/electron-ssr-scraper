import 컴포넌트 from '../컴포넌트/컴포넌트';
import 헤더 from '../헤더/헤더';
// import 스크랩 from '../../js/scrap';
// import {mkdirSync} from 'fs';
// import {join} from 'path';
// import 성분_배열 from '../../data/ingredients';
import {
  요소_찾기,
  DOM_생성,
  마지막_페이지_번호_탐색,
  쿼리_스트링이_있다면,
  페이지_번호_배열_생성,
  페이지_제품_URL_배열_탐색,
  URL_배열_DOM_파싱,
  제품_URL_탐색
} from '../../js/domUtility/domUtility';

interface 헤더_속성 {
  검색_유형: string;
  검색어: string;
  마지막_페이지_번호: number;
  검색_유형_변경(검색_유형: string): void;
  검색(URL_접두사: string, 검색어: string): void;
  다운로드(시작_페이지_번호: number, 끝_페이지_번호: number): void;
}

interface 상태 {
  URL: string;
  검색_유형: string;
  검색어: string;
  마지막_페이지_번호: number;
}

export default class 앱 extends 컴포넌트 {
  상태: 상태 = {
    URL: '',
    검색_유형: 'keyword',
    검색어: '',
    마지막_페이지_번호: 0
  };

  HTML_추가() {
    const {부모} = this;

    부모.innerHTML = `
      <div data-component="app">
        <div data-testid="header-container"></div>
      </div>
    `;
  }

  자식_렌더() {
    this.헤더_생성();

    this.자식_배열.forEach((자식) => {
      자식.렌더();
    });
  }

  헤더_생성() {
    const {부모} = this;
    const {검색_유형, 검색어, 마지막_페이지_번호} = this.상태;
    const 속성: 헤더_속성 = {
      검색_유형,
      검색어,
      마지막_페이지_번호,
      검색_유형_변경: this.검색_유형_변경.bind(this),
      검색: this.검색.bind(this),
      다운로드: this.다운로드.bind(this)
    };
    const 컨테이너_선택자 = '[data-testid="header-container"]';
    const 컴포넌트_컨테이너 = 요소_찾기(부모, 컨테이너_선택자) as HTMLDivElement;
    const 컴포넌트 = new 헤더(컴포넌트_컨테이너, 속성);

    this.자식_배열.push(컴포넌트);
  }

  검색_유형_변경(검색_유형: string): void {
    this.상태_변경({
      검색_유형: 검색_유형
    });
  }

  async 검색(URL_접두사: string, 검색어: string) {
    const URL = URL_접두사 + 검색어;
    const DOM = await DOM_생성(URL);
    const 마지막_페이지_번호 = 마지막_페이지_번호_탐색(DOM);
    // console.log(검색어);
    // console.log(URL);
    // console.log(DOM);
    // console.log(마지막_페이지_번호);

    this.상태_변경({
      URL,
      마지막_페이지_번호,
      검색어
    });

    // console.log(this.상태);
  }

  async 다운로드(시작_페이지_번호: number, 끝_페이지_번호: number) {
    const {URL: 기본_URL} = this.상태;
    const URL = 쿼리_스트링이_있다면(기본_URL) ? 기본_URL + '&p=' : 기본_URL + '?p=';
    const 페이지_번호_배열 = 페이지_번호_배열_생성(시작_페이지_번호, 끝_페이지_번호);
    const URL_배열 = 페이지_번호_배열.map((페이지_번호) => URL + 페이지_번호);
    const DOM_배열 = await URL_배열_DOM_파싱(URL_배열);
    const 제품_URL_배열 = DOM_배열.map((DOM) => 페이지_제품_URL_배열_탐색(DOM)).flat();
    const 제품_DOM_배열 = await URL_배열_DOM_파싱(제품_URL_배열);

    제품_DOM_배열.forEach((제품_DOM) => {
      console.log(제품_URL_탐색(제품_DOM));
    });
    // 페이지_제품_URL_배열_탐색

    // const DOM_배열 = URL_배열.map(async (제품_URL) => await DOM_생성(제품_URL)).map((v) => v);

    // 페이지_번호_배열
    // console.log(페이지_번호_배열);
    // if(URL) {
    // }
  }
  // 유형_변경(새_유형: string) {
  //   this.상태_설정({유형: 새_유형, 검색어: ''});
  // }

  // async 검색(새_검색어: string) {
  //   if (새_검색어 === '') {
  //     return;
  //   }

  //   const {유형} = this.상태;
  //   let URL: string = '';
  //   let 검색어: string = '';

  //   switch (유형) {
  //     case 'keyword': {
  //       URL = `https://kr.iherb.com/search?kw=${새_검색어}`;
  //       검색어 = 새_검색어;

  //       break;
  //     }

  //     case 'brand': {
  //       URL = `https://kr.iherb.com/c/${새_검색어}`;
  //       검색어 = 새_검색어
  //         .split('-')
  //         .map((v) => v[0].toUpperCase() + v.slice(1))
  //         .join(' ');

  //       break;
  //     }
  //   }

  //   const HTML_텍스트 = await 스크랩.페이지_요청(URL);
  //   const 검색_페이지 = 스크랩.DOM_변환(HTML_텍스트);
  //   const 마지막_페이지_번호 = 스크랩.마지막_페이지_번호_질의(검색_페이지);

  //   this.상태_설정({URL, 검색어, 마지막_페이지_번호});
  // }

  // async 다운로드(시작_페이지_번호: number, 끝_페이지_번호: number) {
  //   const 제품_배열: {[key: string]: any}[] = [];
  //   const 시작_시간 = Date.now();

  //   try {
  //     const {유형, URL} = this.상태;
  //     const 검색_URL = 유형 === 'keyword' ? `${URL}&p=` : `${URL}?p=`;

  //     /* 입력 범위내의 페이지 제품들 검색 */
  //     const 페이지_제품_URL_배열 = await 스크랩.범위_페이지_검색(검색_URL, 시작_페이지_번호, 끝_페이지_번호);

  //     /* 제품 배열 생성 */
  //     let cnt = 0;
  //     let productCnt = 0;

  //     for await (const 제품_URL_배열 of 페이지_제품_URL_배열) {
  //       console.log(`${++cnt}번째 페이지 제품 필터 시작`);

  //       for await (const 제품_URL of 제품_URL_배열) {
  //         const 응답 = await fetch(제품_URL);

  //         if (!응답.ok) {
  //           console.log(`에러 발생 : ${--cnt}번째 페이지의 제품들이 다운됩니다.`);

  //           throw new Error(응답.status.toString());
  //         }

  //         const HTML_텍스트 = await 응답.text();
  //         const 제품_페이지 = 스크랩.DOM_변환(HTML_텍스트);
  //         const 이름 = 스크랩.제품_이름_질의(제품_페이지) as string;
  //         const 설명 = 스크랩.제품_설명_질의(제품_페이지) as string;

  //         productCnt++;

  //         if (!스크랩.금지_성분_유무(성분_배열, 이름 + 설명)) {
  //           console.log(`${cnt}번째 페이지 ${productCnt}번 제품 통과`);

  //           const [별점, 후기_수] = 스크랩.제품_후기_질의(제품_페이지);
  //           const 가격 = 스크랩.제품_가격_질의(제품_페이지) as string;

  //           제품_배열.push({
  //             이름,
  //             별점,
  //             후기_수,
  //             가격,
  //             상태: 스크랩.제품_상태_질의(제품_페이지),
  //             사용법: 스크랩.제품_사용법_질의(제품_페이지),
  //             이미지_URL_배열: 스크랩.제품_이미지_URL_질의(제품_페이지),
  //             이미지_파일_이름_배열: [],
  //             배송비: Number(가격.slice(1)) < 20 ? '$5' : null,
  //             URL: 제품_URL,
  //             브랜드: 이름.split(',')[0]
  //           });
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`에러 : ${err}`);
  //   } finally {
  //     /* 제품 이미지 파일 저장 */
  //     console.log(`총 ${제품_배열.length}개의 제품이 검색되었습니다.`);
  //     console.log(`파일 다운 시작`);
  //     const 관련_폴더_이름 = join(__dirname, '/products/');
  //     let 제품_번호 = 0;

  //     for await (const 제품 of 제품_배열) {
  //       const {이름, 이미지_URL_배열} = 제품;
  //       // /* 폴더명으로 사용 불가능한 문자 제거 */
  //       const 수정된_이름 = 이름.replace(/[<>:?*"\/\\]/g, '.');
  //       const 폴더_이름 = `${'0'.repeat(3 - String(++제품_번호).length)}${제품_번호}-${수정된_이름}`;
  //       const 폴더_경로 = join(관련_폴더_이름 + 폴더_이름);
  //       mkdirSync(폴더_경로);
  //       let 이미지_번호 = 0;
  //       for await (const 이미지_URL of 이미지_URL_배열) {
  //         const 파일_이름 = `${폴더_이름}-${++이미지_번호}.jpg`;
  //         제품.이미지_파일_이름_배열.push(파일_이름);
  //         await 스크랩.이미지_저장(이미지_URL, `${폴더_경로}/${파일_이름}`);
  //       }
  //       console.log(`${제품_번호}번 제품 이미지 다운 완료`);
  //     }
  //     await 스크랩.엑셀_저장(제품_배열, 관련_폴더_이름 + `Products${Date.now()}.xlsx`);
  //     console.log(`엑셀 파일 다운 완료`);
  //     const 소요_시간 = Date.now() - 시작_시간;
  //     console.log(`소요 시간 : ${Math.trunc(소요_시간 / 1000)}초`);
  //   }
  // }

  // 자식_컴포넌트_렌더() {
  //   const 헤더_컨테이너 = this.부모_컴포넌트.querySelector('[data-component="header-container"]') as HTMLDivElement;
  //   const 속성 = {
  //     ...this.상태,
  //     유형_변경: this.유형_변경.bind(this),
  //     검색: this.검색.bind(this),
  //     다운로드: this.다운로드.bind(this)
  //   };
  //   const 헤더_컴포넌트 = new 헤더(헤더_컨테이너, 속성);

  //   헤더_컴포넌트.렌더();
  // }
}
