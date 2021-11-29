import 컴포넌트 from '../컴포넌트/컴포넌트';
import {요소_값_반환, 요소_찾기} from '../../js/domUtility/domUtility';

interface 속성 {
  다운로드(시작_페이지_번호: number, 끝_페이지_번호: number): void;
}

export default class 다운로드_바 extends 컴포넌트 {
  constructor(부모: HTMLElement, 속성: 속성) {
    super(부모);

    this.속성 = 속성;
  }

  HTML_추가() {
    const {부모} = this;

    // TODO: 컴포넌트를 더 작게 나눌 수 있을 것 같다.
    부모.innerHTML = `
      <div data-testid="download-bar">
        <input data-testid="download-bar-start-page" name="startPageNum" type="text" placeholder="시작 페이지 번호">
        <input data-testid="download-bar-end-page" name="endPageNum" type="text" placeholder="끝 페이지 번호">
        <button data-testid="download-bar-button" type="button">다운로드</button>
      </div>
    `;
  }

  이벤트_설정() {
    const 다움로드_버튼_선택자 = '[data-testid="download-bar-button"]';
    const 다운로드_버튼 = this.부모.querySelector(다움로드_버튼_선택자) as HTMLButtonElement;

    다운로드_버튼.addEventListener('click', this.클릭_이벤트.bind(this));
  }

  async 클릭_이벤트() {
    const {다운로드} = this.속성;
    const {부모} = this;

    // TODO: 반복되는 명령을 줄여야 할 것 같다.
    const 시작_페이지_번호_인풋_선택자 = '[data-testid="download-bar-start-page"]';
    const 시작_페이지_번호_인풋 = 요소_찾기(부모, 시작_페이지_번호_인풋_선택자) as HTMLInputElement;
    const 시작_페이지_번호 = Number(요소_값_반환(시작_페이지_번호_인풋));

    const 끝_페이지_번호_인풋_선택자 = '[data-testid="download-bar-end-page"]';
    const 끝_페이지_번호_인풋 = 요소_찾기(부모, 끝_페이지_번호_인풋_선택자) as HTMLInputElement;
    const 끝_페이지_번호 = Number(요소_값_반환(끝_페이지_번호_인풋));

    await 다운로드(시작_페이지_번호, 끝_페이지_번호);
  }
}
