export default class ezPrint{
  constructor() {
    this.iframe = {};
    this.document = {};
    this.body = {};
    this.iframe = document.createElement('iframe');
    let iframe = this.iframe;
    // iframe.setAttribute('style','position:absolute;width:0;height:0;left:-5000px;top:-5000px')
    iframe.setAttribute('style','position:absolute')

    document.getElementsByTagName('body')[0].appendChild(this.iframe);
    // iframe.contentWindow.document.body.appendChild(iframe.contentDocument.createElement('p'))
    // this.ifrDocument = this.iframe.contentDocument;
    iframe.onload = ()=>{
      this.document = iframe.contentDocument;
      this.document.firstChild.width;
      console.log(this.document);
      let document = this.document;
      let bodyTag = this.document.body;
      this.body = bodyTag;
      let headTag = this.document.head;
      this.headTag = headTag;
      let style = document.createElement('style');
      style.innerText=
          'table.content-container {\n' +
          '    page-break-after:always;\n' +
          '}\n' +
          'thead.content-header {\n' +
          '    display:table-header-group;\n' +
          '}\n' +
          'tfoot.content-footer {\n' +
          '    display:table-footer-group;\n' +
          '}' +
          '@page {' +
          ' size:A4;' +
          ' margin:0' +
          '}'
      headTag.appendChild(style);
    }
    console.log(iframe);
    return this;
  }

  setPrintContent(){
    // console.log(this.ifrDocument);
    // let ifrDocument = this.ifrDocument;
    let tableTag = this.iframe.contentDocument.createElement('table');
    let theadTag = this.iframe.contentDocument.createElement('thead');
    let tfootTag = this.iframe.contentDocument.createElement('tfoot');
    let tbodyTag = this.iframe.contentDocument.createElement('tbody');
    //
    theadTag.classList.add("content-header");
    tfootTag.classList.add("content-footer");
    tableTag.classList.add("content-container");
    // theadTag.setAttribute('display', 'table-header-group');
    // tfootTag.setAttribute('display', 'table-footer-group');
    // tableTag.setAttribute('page-break-after', 'always');

    let headContent = this.document.createElement('div');
    headContent.innerText = '这个是表头的内容';
    theadTag.appendChild(this.document.createElement('tr').appendChild(this.document.createElement('th').appendChild(headContent)))
    //
    tableTag.appendChild(theadTag);
    tableTag.appendChild(tfootTag);
    tableTag.appendChild(tbodyTag);
    //
    // let a = this.iframe.contentDocument.createElement('p')
    // a.innerText='111';
    this.body.appendChild(tableTag)
    // console.log(this.iframe);
    // this.iframe.contentDocument.appendChild(tableTag);
    console.log(getPPI());

  }

  print(){
    this.iframe.contentWindow.print();
  }
}

function getPPI(){
  // create an empty element
  var div = document.createElement('div');
// give it an absolute size of one inch
  div.style.width='1in';
// append it to the body
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(div);
// read the computed width
  var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
// remove it again
  body.removeChild(div);
// and return the value
  return parseFloat(ppi);
}