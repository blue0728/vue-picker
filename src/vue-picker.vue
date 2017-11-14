<style scoped>
.border-bottom-1px,
.border-top-1px {
    position: relative;
}
.border-bottom-1px:after,
.border-bottom-1px:before,
.border-top-1px:after,
.border-top-1px:before {
    position: absolute;
    display: block;
    content: '';
    transform-origin: 0 0;
}.border-top-1px:before {
    top: 0;
    left: 0;
    width: 100%;
	transform-origin: 0 top;;
    border-top: 1px solid #ebebeb;
}.border-bottom-1px:after {
    bottom: 0;
    left: 0;
    width: 100%;
	transform-origin: 0 bottom;;
	border-bottom: 1px solid #ebebeb;
}@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2) {
    .border-top-1px:before {
        width: 200%;
        transform: scale(.5) translateZ(0);
    }
	.border-bottom-1px:after {
        width: 200%;
        transform: scale(.5) translateZ(0);
    }
}@media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3) {
    .border-top-1px:before {
        width: 300%;
        transform: scale(.333) translateZ(0);
    }.border-bottom-1px:after {
        width: 300%;
        transform: scale(.333) translateZ(0);
    }
}


.picker-fade-enter, .picker-fade-leave-active{
    opacity: 0
}

.picker-fade-enter-active, .picker-fade-leave-active{
  	transition: all .3s ease-in-out	
}

.picker-move-enter, .picker-move-leave-active{
    transform: translate3d(0, 273px, 0)
}

.picker-move-enter-active, .picker-move-leave-active{
    transition: all .3s ease-in-out
}



@b picker {
	background: rgba(37,38,45,.4);
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	user-select: none;

	@m panel {
		position: absolute;
		z-index: 600;
		bottom: 0;
		width: 100%;
		height: 273px;
		background: #fff;
	}

	@m choose {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		height: 60px;


		label{
			font-size: 14px;
			padding: 0 20px;
			color: #999;
		}

		.confirm{
			color: #007bff;
		}

		h4{
			font-size: 18px;
			color: #333;
			font-weight: 400;
		}
	}

	@m content{
		position: relative;
		top: 20px;
	}
}

@b mask{
	position: absolute;
	z-index: 10;
    width: 100%;
    height: 68px;
    pointer-events: none;
    transform: translateZ(0);

	@m top{
		top: 0;
    	background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.5));
	}

	@m bottom{
    	bottom: 0;
    	background: linear-gradient(0deg, rgba(255,255,255,.9), rgba(255,255,255,.5));
	}
}

@b wheel{
	flex: 1;
	text-align: center;
    height: 173px;
    overflow: hidden;
    font-size: 20px;

	@m wrapper{
		display: flex;
    	padding: 0 16px;
	}

	ul {
	    padding: 0;
		margin-top: 68px;
		line-height: 36px;
		list-style: none;	
		width: 100%;
		li{
			list-style: none;
		    height: 36px;
		    overflow: hidden;
		    white-space: nowrap;
		    color: #333;
		}
	}

}

</style>
<template>
	<transition name="picker-fade">
		<div class="picker" v-show="state===1" @touchmove.prevent @click="cancel">
			<transition name="picker-move">
				<div class="picker--panel" v-show="state===1" @click.stop>
					<div class="picker--choose border-bottom-1px">
						<label class="cancel" @click="cancel">{{cancelTxt}}</label>
						<h4>{{title}}</h4>
						<label class="confirm" @click="confirm">{{confirmTxt}}</label>
					</div>
					<div class="picker--content">
						<div class="mask mask--top border-bottom-1px"></div>	
						<div class="mask mask--bottom border-top-1px"></div>
						<div class="wheel--wrapper" ref="wheelWrapper">
							<div class="wheel" v-for="data in pickerData">
								<ul class="wheel-scroll">
									 <li v-for="item in data" :data-item="JSON.stringify(item)" class="wheel-item">{{item.text}}</li>
								</ul>
							</div>
						</div>	
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>
<script>
	import BScroll from 'better-scroll';


    const STATE_HIDE = 0
  	const STATE_SHOW = 1

  	const COMPONENT_NAME = 'vue-picker'	
  	const EVENT_SELECT = 'select'
  	const EVENT_CANCEL = 'cancel'
  	const EVENT_SHOW = 'show'
  	const EVENT_CHANGE = 'change'

	export default{
		name: COMPONENT_NAME,
		props: {
	      	title: {
	        	type: String,
	        	default: '请选择'
	      	},
	      	cancelTxt: {
	        	type: String,
	        	default: '取消'
	      	},
	      	confirmTxt: {
	        	type: String,
	        	default: '确认'
	      	},
	      	selectedIndex: {
		        type: Array,
		        default() {
		          return []
		        }
		    },
		    data: {
		        type: Array,
		        default() {
		          return []
		        }
		    }
	    },
		data: function(){
			return {
		        state: STATE_HIDE,
		        pickerData: this.data.slice(),
		        pickerSelectedIndex: this.selectedIndex,
		        pickerSelectedVal: [],
		        pickerSelectedText: [],
		        pickerSelectedItem: []
			}
		},
		mounted: function(){
			this.$nextTick(() => {
				if (!this.pickerSelectedIndex.length) {
			        this.pickerSelectedIndex = [];
			        this.pickerData.forEach((item, index) => {
						this.pickerSelectedIndex[index] = 0
					})
			    }
			})
		},
		methods: {
			show: function(){
				if(this.state === STATE_SHOW){
					return;
				}

				this.state = STATE_SHOW;

				if(!this.wheels){
					this.$nextTick(() => {
						this.wheels = [];
						let wheelWrapper = this.$refs.wheelWrapper;
						this.pickerData.forEach((item, index) => {
							this._createWheel(wheelWrapper, index)
						})
					})
				}else{
					this.pickerData.forEach((item, index) => {
						this.wheels[index].enable()
            			this.wheels[index].wheelTo(this.pickerSelectedIndex[index])
					})
				}
				this.$emit(EVENT_SHOW)
			},
			hide: function(){
				this.state = STATE_HIDE;

				this.pickerData.forEach((item, index) => {
					this.wheels[index].disable()
				})				
			},
			cancel: function(){
				this.hide()
				this.$emit(EVENT_CANCEL)
			},
			confirm: function(){
				if (!this._canConfirm()) {
		          	return
		        }
		        this.hide()
		        let changed = false
		        this.pickerData.forEach((item, index) => {
		        	let _index = this.wheels[index].getSelectedIndex()
          			this.pickerSelectedIndex[index] = _index //选择下标
          			this.pickerSelectedText[index] = this.pickerData[index][_index] ? this.pickerData[index][_index].text : '' //选中text
          			this.pickerSelectedVal[index] = this.pickerData[index][_index] ? this.pickerData[index][_index].value : '' //选中vlue
          			this.pickerSelectedItem[index] = this.pickerData[index][_index] ? this.pickerData[index][_index] : null   //选中完整对象

		        })		

		        this.$emit(EVENT_SELECT, this.pickerSelectedVal, this.pickerSelectedIndex, this.pickerSelectedText, this.pickerSelectedItem)

			},
			_createWheel: function(wheelWrapper, i){
				if (!this.wheels[i]) {

		          	this.wheels[i] = new BScroll(wheelWrapper.children[i], {
			            wheel: {
			              	selectedIndex: this.pickerSelectedIndex[i]
			            },
			            probeType: 3
			        })

		          	//滑动结束派发一个event_change	
		          	this.wheels[i].on('scrollEnd', () => {
		           		this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
		          	})
		        } else {
		          	this.wheels[i].refresh()
		        }

		        return this.wheels[i]
			},
			refresh() {
		        setTimeout(() => {
		          	this.wheels.forEach((wheel, index) => {
		            	wheel.refresh()
		          	})
		        }, 200)
		    },
		    scrollTo(index, dist) {
		        const wheel = this.wheels[index]
		        this.pickerSelectedIndex[index] = dist
		        wheel.wheelTo(dist)
		    },
		    _canConfirm() {
		        return this.wheels.every((wheel) => {
		    	    return !wheel.isInTransition
		        })
		    },
		    setSelectedIndex(index) {
		        this.pickerSelectedIndex = index
		    },
		    setData(data) {
		        this.pickerData = data.slice()
		    }
		},
		watch: {
		    data: function(newData) {
		        this.setData(newData)
		    }
	    }
	}
</script>