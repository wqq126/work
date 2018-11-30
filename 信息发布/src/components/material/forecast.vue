<template>
	<div id="wheatherForecast">
		我是天气预报
	</div>
</template>

<script>
	export default {
		data () {
			return {
				
			}
		},
		beforeRouteEnter (to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('materialName', '1')
			})
		}
	}
</script>

<style>
</style>