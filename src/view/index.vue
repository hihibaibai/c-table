<template>
	<div>
		<div>
			<button @click="foobar">foobar</button>
			<button @click="render">render</button>
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
export default {
	name: "index",
	mounted() {
		this.init();
	},
	data() {
		return {
			xs: {},
			toolbar: {}
		}
	},
	methods: {
		foobar() {
			console.log(this.xs);
			// this.xs.addBorder('A2:A3', 'left', 'medium', '#21ba45').render();
			this.xs.addStyle({bold:true});
			this.xs.addBorder({right: ['medium', '#21ba45'], bottom:['medium', '#21ba45']})

			// debugger;
			this.xs.setCell(0,0,{value:'11111',border:0,style:0}).render();
			// this.xs.data(this.xs.data())
			// console.log(this.xs.data());
			// console.log(this.toolbar.getCurrentStyle());
			// this.init();
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