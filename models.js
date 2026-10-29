const mongoose = require('mongoose');
const {Schema, model}=mongoose;
const opts={timestamps:true};
const counter=model('Counter',new Schema({_id:String,seq:{type:Number,default:0}}));
async function nextId(collection){const row=await counter.findByIdAndUpdate(collection,{$inc:{seq:1}},{upsert:true,new:true,setDefaultsOnInsert:true});return row.seq;}
function entity(name,fields){return model(name,new Schema({id:{type:Number,unique:true,index:true,required:true},...fields},opts));}
const User=entity('User',{usuario:{type:String,unique:true,required:true},password_hash:{type:String,required:true},rol:{type:String,enum:['admin','empleado'],default:'empleado'}});
const Category=entity('Category',{nombre:{type:String,required:true,unique:true}});
const Product=entity('Product',{categoria_id:{type:Number,required:true,index:true},nombre:{type:String,required:true},descripcion:{type:String,default:''},precio:{type:Number,min:0,required:true},activo:{type:Boolean,default:true}});
const Inventory=entity('Inventory',{producto_id:{type:Number,unique:true,required:true},cantidad:{type:Number,min:0,required:true,default:0},fecha_actualizacion:{type:Date,default:Date.now}});
const Customer=entity('Customer',{nombre:{type:String,required:true},telefono:String,direccion:String});
const Order=entity('Order',{cliente_id:{type:Number,default:null},total:{type:Number,required:true},estado:{type:String,enum:['pendiente','preparando','entregado','cancelado'],default:'pendiente'},fecha:{type:Date,default:Date.now},items:[{producto_id:Number,cantidad:Number,precio_unitario:Number,subtotal:Number}]});
const Sale=entity('Sale',{pedido_id:{type:Number,unique:true,required:true},total:{type:Number,required:true},fecha:{type:Date,default:Date.now}});
const Waste=entity('Waste',{tipo:{type:String,enum:['verde','blanco','negro'],required:true},descripcion:{type:String,required:true},cantidad:{type:Number,required:true,min:0},unidad:{type:String,enum:['kg','litros','unidades'],required:true},fecha:{type:String,required:true},observaciones:String});
module.exports={mongoose,nextId,User,Category,Product,Inventory,Customer,Order,Sale,Waste};
