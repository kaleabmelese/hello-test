//var config = require('./accounts')
const axios = require('axios')
const baseURL = 'https://api-et.hellocash.net'
const uuid = require('uuid/v1');

const hellocash = {
    login: async (principal,credentials,system="lucy")=>{
        let body = {
            "principal": principal,
            "credentials": credentials,
            "system": system
        }
        return (await axios.post(`${baseURL}/authenticate`,body)).data.token;
    },
    getInvoices: async (param,token)=>{
        let config = {
            url: `${baseURL}/invoices`,
            method: "get",
            headers: {authorization:`Bearer ${token}`},
            params: param
         }
         return (await axios(config)).data;
    },
    postInvoices: async (invoice,token)=>{
        let config = {
            url: `${baseURL}/invoices`,
            method: "post",
            headers: {authorization:`Bearer ${token}`},
            data: invoice
        }
        return (await axios(config)).data; 
    },
    validateInvoice: async (invoice,token) =>{
        let config = {
            url: `${baseURL}/invoices/validate`,
            method: "post",
            headers: {authorization:`Bearer ${token}`},
            data: invoice
        }
        return (await axios(config)).data; 
    },
    deleteInvoice: async (id,token)=>{
        let config = {
            url: `${baseURL}/invoices/${id}`,
            method: "delete",
            headers: {authorization:`Bearer ${token}`},
        }  
        return (await axios(config)).data;
    },
    getTransfers: async (param,token)=>{
        let config = {
            url: `${baseURL}/transfers`,
            method: "get",
            headers: {authorization:`Bearer ${token}`},
            params: param
        }
        return (await axios(config)).data;  
    },
    postTransfer: async (invoice,token)=>{
        let config = {
            url: `${baseURL}/transfers`,
            method: "post",
            headers: {authorization:`Bearer ${token}`},
            data: invoice
        }
        return (await axios(config)).data; 
    },
    validateTransfer: async (invoice,token)=>{
        let config = {
            url: `${baseURL}/transfers`,
            method: "post",
            headers: {authorization:`Bearer ${token}`},
            data: invoice
        }
        return (await axios(config)).data;
    },
    authrizeTransfer: async (id,token)=>{
        let config = {
            url: `${baseURL}/transfers/authorize`,
            method: "post",
            headers: {authorization:`Bearer ${token}`},
            data : [id]
        }
        return (await axios(config)).data;
    }
}

hellocash.login("1416563","lucy1234").then(res=>{
    //console.log(res);
    var invoice = {
        "amount": 10,
        "description": "",
        "from": "+2519",
        "currency": "ETB",
        "tracenumber": uuid(),
        "notifyfrom": true,
        "notifyto": true,
        "expires": ""
    }
    var transfer = {
        "amount": 1,
        "description": "",
        "to": "+251944233167",
        "currency": "ETB",
        "tracenumber": uuid(),
        "referenceid": uuid(),
        "notifyfrom": true,
        "notifyto": true
    }
    hellocash.validateTransfer(transfer,res).then(res=>console.log(res),err=>console.log(err.response.data));
   
},err=>{
    console.log(err.data);
});
