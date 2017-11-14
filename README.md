
## Install
```
npm install vue-picker --save

```

## Info

`vue-picker` 使用了 `better-scroll`  [@ustbhuangyi](https://github.com/ustbhuangyi)，非常感谢

## API

```js
    <button @click="show">点击</button>
    <vue-picker ref="picker" :data="data" @select="select"></vue-picker>
```

## Usage

```js

import vuePicker from 'vue-picker'

var app = new Vue({
  el: '#app',
  components: {
    vuePicker
  },
  methods: {
    show: function(){
        this.$refs['picker'].show();
    },
    select: function(){
        console.log(arguments)
    }
  },
  data: {
    data: [[
      text: 1,
      value: 'value1'
    ],[
      text: 2,
      value: 'value2'
    ],[
      text: 3,
      value: 'value3'
    ]]
  }
})
```


