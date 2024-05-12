<template>
  <q-card dark class="code">
    <q-card-section>
        <q-bar v-if="isWindows" class="bg-black text-white">
            <q-btn dense flat icon="content_copy" @click="copyCodeToClipboard">
                <q-tooltip>
                  {{$t("code_shower.copy")}}
                </q-tooltip>
            </q-btn>
            <div class="col text-center text-weight-bold">
              {{$t("code_shower.generated_code")}}
            </div>
            <q-btn dense flat icon="minimize" @click="this.$emit('close')"/>
            <q-btn dense flat icon="crop_square" />
            <q-btn dense flat icon="close" @click="this.$emit('close')"/>
        </q-bar>
        <q-bar v-else>
            <q-btn dense flat round icon="lens" size="8.5px" color="red" @click="this.$emit('close')"/>
            <q-btn dense flat round icon="lens" size="8.5px" color="yellow" @click="this.$emit('close')"/>
            <q-btn dense flat round icon="lens" size="8.5px" color="green" />
            <div class="col text-center text-weight-bold">
              {{$t("code_shower.generated_code")}}
            </div>
            <q-btn dense flat icon="content_copy" @click="copyCodeToClipboard">
                <q-tooltip>
                  {{$t("code_shower.copy")}}
                </q-tooltip>
            </q-btn>
        </q-bar>
      <highlightjs
        style="width: 100%; margin:0"
        language="javascript"

        :code="e2Code"
    />
    </q-card-section>
  </q-card>
</template>

<script>
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/styles/atom-one-dark.css'
import { colors } from 'quasar'
import { mapState } from 'pinia'
import { useScreensStore } from '@/stores/screensObjects'

hljs.registerLanguage('javascript', javascript);

  export default {
    name: "CodeShower",
    components: {
        highlightjs: hljsVuePlugin.component
    },
    computed: {
      ...mapState(useScreensStore, ['screensObjects']),
      isWindows() {
        return navigator.platform.startsWith("Win") 
      },
      e2Code() {

let text = 
`@name EasyEGP
@inputs EGP:wirelink ${this.needUserInteraction() ? "User:entity" : ""}
@persist ActiveScreen:number

if(first() | duped() | dupefinished()) {
`
  
for(let screenI=0; screenI<this.screensObjects.length; screenI++) {
  let shapes = this.screensObjects[screenI]
  text +=`
  function drawScreen${screenI}() {
    EGP:egpClear()`
          
  for(let i=0; i<shapes.length; i++) {
    let shape = shapes[i]
    let fillColor = colors.textToRgb(shape.fill)
    let strokeColor = colors.textToRgb(shape.stroke ? shape.stroke : "rgba(0,0,0,0)") 
    text+="\n"
    if (shape.type == "rect") { // Box
      text+=`
    EGP:egpBox${shape.filled ? "" :"Outline"}(${i+1},vec2(${shape.left},${shape.top}),vec2(${shape.width+(!shape.filled?shape.strokeWidth:0)},${shape.height+(!shape.filled?shape.strokeWidth:0)}))`
    } else if (shape.type == "ellipse") { // Circle
      text+=`
    EGP:egpCircle${shape.filled ? "" :"Outline"}(${i+1},vec2(${shape.left},${shape.top}),vec2(${shape.rx+(!shape.filled?shape.strokeWidth:0)},${shape.ry+(!shape.filled?shape.strokeWidth:0)}))`
    } else if (shape.type == "polygon") { // Polygon
      text+=`
    EGP:egpPoly(${i+1}`
    shape.points.forEach(point => {
      text+=`, vec2(${shape.left + point.x},${shape.top + point.y})`
    });
    text+=")"
    } else if (shape.type == "i-text") {
      text+=`
    EGP:egpText(${i+1},${this.needEncoding(shape.text) ? 'httpUrlDecode("'+encodeURI(shape.text)+'")': '"'+shape.text+'"'},vec2(${shape.left},${shape.top}))`
      //Align
      if (shape.originX!="left" || shape.originY!="top") {
        text+=`
    EGP:egpAlign(${i+1},${shape.originX=="left"?0:shape.originX=="center"?1:2},${shape.originY=="top"?0:shape.originY=="center"?1:2})`
      }
    }
            
    //Color
    let color = shape.filled? fillColor : strokeColor
    if(color.r!=255 || color.g!=255 || color.b!=255 || color.a!=100) {
      text+=`
    EGP:egpColor(${i+1},vec4(${color.r},${color.g},${color.b},${Math.round(color.a * 2.55)}))`
    }

    //Angle
    if(shape.angle) {
      text+=`
    EGP:egpAngle(${i+1},${360-shape.angle})`
    } //Size
    if(shape.strokeWidth && shape.strokeWidth>1 && !shape.filled) {
      text+=`
    EGP:egpSize(${i+1},${shape.strokeWidth})`
    }
    if(shape.fontSize) {
      text+=`
    EGP:egpSize(${i+1},${shape.fontSize})`
    }
  }

  text +=`
  }
  `
}

text+=`
  ActiveScreen = 0
  function drawActiveScreen() {
    ("drawScreen"+ActiveScreen)()
  }

  drawActiveScreen()
}
` 
if(this.needUserInteraction()) {
  text+=`
if(~User & User) {
  local Cursor = EGP:egpCursor(User)
  `
  let firstScreen = true
  for(let screenI=0; screenI<this.screensObjects.length; screenI++) {
    if(!this.needUserInteraction(screenI)) {continue}
    text+=`
  ${firstScreen ? "" : "else"}if(ActiveScreen==${screenI}) {`
    firstScreen = false
    let firstShape = true
    for(let shapeI=0; shapeI<this.screensObjects[screenI].length; shapeI++) {
      let shape = this.screensObjects[screenI][shapeI]
      if(!shape.actions || shape.actions.length==0 || !shape.filled) {continue}
      text+=`
    ${firstShape ? "" : "else"}if(EGP:egpObjectContainsPoint(${shapeI+1},Cursor)) {`
      firstShape = false
      for(let action of shape.actions) {
        if(action.type == "remove") {
          text+=`
      EGP:egpRemove(${action.objIndex})`
        } else if(action.type == "changeText") {
          text+=`
      EGP:egpSetText(${action.objIndex},"${action.newText}")`
        } else if(action.type == "move") {
          text+=`
      EGP:egpPos(${action.objIndex},vec2(${action.left},${action.top}))`
        } else if(action.type == "switchScreen") {
          text+=`
      ActiveScreen = ${action.gotoScreen-1}
      drawActiveScreen()`
        }
      }
      text+=`
    }`
    }
    text+=`
  }`
  }
  text+=`
}`
}
text+=`
if(~EGP) {
    drawActiveScreen()
}`
return text
}
    },
    methods: {
      needUserInteraction(i) {
        if(i!=null) {
          for(let shape of this.screensObjects[i]) {
            if(shape.actions && shape.actions.length>0 && shape.filled) {return true}
          }
        } else {
          for(let screen of this.screensObjects) {
            for(let shape of screen) {
              if(shape.actions && shape.actions.length>0 && shape.filled) {return true}
            }
          }
        }
        return false
      },
      needEncoding(text) {
        return text != encodeURI(text)
      },
      copyCodeToClipboard() {
        navigator.clipboard.writeText(this.e2Code);
        this.$q.notify({
          message: this.$t("code_shower.copied"),
          color: 'orange'})
      }
    },
  }
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.code::-webkit-scrollbar {
    display: none;
}
  
/* Hide scrollbar for IE, Edge and Firefox */
.code {
    min-width: 40%;
    max-height: 70vh;
    overflow-y: scroll;
    border-radius: 15px !important;
    box-shadow:0px 5px 20px  black !important;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
} 
</style>