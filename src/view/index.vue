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