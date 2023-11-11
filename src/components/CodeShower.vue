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

hljs.registerLanguage('javascript', javascript);

  export default {
    name: "CodeShower",
    props: {
      shapes: {
        type: Array,
        default: []
      },
    },
    components: {
        highlightjs: hljsVuePlugin.component
    },
    computed: {
        isWindows() {
            return navigator.platform.startsWith("Win") 
        },
        e2Code() {
          let text = 
`@name EasyEGP
@inputs EGP:wirelink

if(first() | duped() | dupefinished()) {
  
  function drawEGP() {
    EGP:egpClear()`
          
          for(let i=0; i<this.shapes.length; i++) {
            let shape = this.shapes[i]
            let fillColor = colors.textToRgb(shape.fill)
            let strokeColor = colors.textToRgb(shape.stroke ? shape.stroke : "rgba(0,0,0,0)") 
            text+="\n"
            if (shape.type == "rect") { // Box
              text+=`
    EGP:egpBox${shape.filled ? "" :"Outline"}(${i+1},vec2(${shape.left},${shape.top}),vec2(${shape.width},${shape.height}))`
            } else if (shape.type == "ellipse") { // Circle
              text+=`
    EGP:egpCircle${shape.filled ? "" :"Outline"}(${i+1},vec2(${shape.left},${shape.top}),vec2(${shape.rx},${shape.ry}))`
            } else if (shape.type == "polygon") { // Polygon
              text+=`
    EGP:egpPoly(${i+1}`
                shape.points.forEach(point => {
                  text+=`, vec2(${shape.left + point.x},${shape.top + point.y})`
                });
                text+=")"
            } else if (shape.type == "i-text") {
              text+=`
    EGP:egpText(${i+1},"${shape.text}",vec2(${shape.left},${shape.top}))`
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
    EGP:egpAngle(${i+1},${shape.angle})`
            }
          }

        text +=
`
  }

  drawEGP()
}
`     
          return text
        }
    },
    methods: {
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
    max-height: 80%;
    overflow-y: scroll;
    border-radius: 15px !important;
    box-shadow:0px 5px 20px  black !important;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
} 
</style>