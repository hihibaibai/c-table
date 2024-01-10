<template>
	<div>
		<div>
			<button @click="foobar">foobar</button>
			<button @click="print">print</button>
			<button @click="render">render</button>
		</div>
		<div>
<!--			<canvas id="canvas" width="100px" height="100px"></canvas>-->
		</div>
		<div id="toolbar"></div>
		<div id="tablePlace"></div>
	</div>
</template>

<script>
import table from '@/components/table/index'
import toolbar from "@/components/table-toolbar/toolbar";
// import table from '@wolf-table/table'
// import spreadSheet from 'x-data-spreadsheet'
import ezPrint from "@/components/ezPrint/ezPrint";
export default {
	name: "index",
	mounted() {
		this.init();
	},
	data() {
		return {
			xs: {},
			toolbar: {},
			printer:{}
		}
	},
	methods: {
		foobar() {
			const data = JSON.parse('{"rows":{"len":100},"cols":{"len":26},"rowHeight":25,"colWidth":100,"scroll":[0,0,0,0],"style":{"bgcolor":"#FFF","color":"#333","align":"left","valign":"middle","textwrap":false,"bold":false,"italic":false,"fontFamily":"Roboto","fontSize":10,"underline":false,"strikethrough":false,"border":{}},"styles":[{"bgcolor":"#000100","color":"#333","align":"left","valign":"middle","textwrap":false,"bold":false,"italic":false,"fontFamily":"Roboto","fontSize":10,"underline":false,"strikethrough":false,"border":{}}],"borders":[{"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"],"bottom":["thin","#000"]}],"merges":[],"cells":[[0,1,{"value":"#{SP_Q_KCPDB.商品编号}"}],[2,0,{"value":"","border":0}],[2,1,{"value":"","border":0}],[2,2,{"border":0,"style":0}],[3,0,{"value":"","border":0}],[3,1,{"value":"","border":0}],[3,2,{"border":0,"style":0}],[4,0,{"value":"","border":0}],[4,1,{"value":"","border":0}],[4,2,{"value":"","border":0}],[1,2,[1,2,{"value":"","style":0}]]]}')
			let printer = {};
			console.log(this.xs);
			// console.log(this.xs.data());
			this.xs.data(data);
			// this.xs.addBorder('A2:A3', 'left', 'medium', '#21ba45').render();
			// this.xs.addStyle({bold:true});
			// this.xs.addBorder({left: ['medium', '#21ba45'], top:['medium', '#21ba45'], right:['medium', '#21ba45']})
			// this.xs.setCell(1,2,{value:'11111',border:0,style:0}).render();

			// debugger;
			// this.xs.data(this.xs.data())
			// console.log(this.xs.data());
			// console.log(this.toolbar.getCurrentStyle());
			// this.init();
			// printer = new ezPrint();
			// setTimeout(()=>{printer.setPrintContent(imageForTest);},1000);
			// setTimeout(()=>{printer.setPrintContent(imageForTest);printer.print()},500);
			// this.printer=printer;
			// printer.setPrintContent();

		},
		print(){
			let printer = new ezPrint();
			let image = this.xs.printContent();
			setTimeout(()=>{printer.setPrintContent(image);},500);
			setTimeout(()=>{printer.print();},1500);
			printer.print();

		},
		render() {
			this.xs.render();
		},
		init() {
			// this.xs = new spreadSheet('#tablePlace',{
			//   width:()=>{1200},
			//   height:()=>{400}
			// })
			this.xs = table.create('#tablePlace', () => 1200, () => 400, {
				scrollable: true,
				resizable: true,
				selectable: true,
				editable: true,
				copyable: true,
			}).render();
			this.toolbar = toolbar.create('#toolbar', this.xs);
		}
	}
}
</script>


<style scoped>

</style>