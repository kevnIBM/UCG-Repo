'use strict'
var express = require('express');
var   router = express.Router();

//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//const PORT = process.env.PORT || 3000;
const uuidv4 = require('uuid/v4');
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQC8F8jj08CAfbMYpfD2h4wow/IeNSnwVjuSsBc3i0SmbYdOcCQK
EkPoB7blT6fP0eCL4WRjAt7OtPW+zxnkuNtqHumnW1/8FDBeMjxOkXZuphSVXQSc
6BUwhPP9zeP7nwWcgruf+YYm0rskpowoNEvUt8bATpu1Jpepw17l528gkQIDAQAB
AoGBAKz5+qd6nzgLYV8zjExMD5uVx9376lu6EgMuqctM6o9bfumlu57/eS+zmIF+
Jce7LZO2bkmX5CuYw778WsW7MxvrQbRebSQ46pJ6zVADh4N/v+UtPG1+xECcIBpy
gZLK5lcl9nL1P8gR21i8F1C3jeoold28oJEIvcMYPhFB/2IhAkEA3G0WTO5sX5ve
9wvNuhlnGDpgboZ2rkCPF+Y6knUX4rdpo3cReIIYiPw2M/7A8vs50xKhRjuJNU6S
tPri8U63pQJBANpy2Y2XiB532qQlumACWS/MESU6eWV6wUfxsT7UxBBVkFNUYzsu
1OEy9H+VaSmv8mQNuenTc6CNmpGkw20fkX0CQCKRoRuzkJ917IPGAB+deEOedB0h
TV+KlGZlHu51Gqfdp92RANZrYLmrBD0nSM9SgwENPOms0JnhlrR3XDwH4lkCQQDC
MxQA8lOKcpanEvtLWwsamNotNHyzoJuvb8hYySG8O7Tgv8av2IRb58bAnX0uGELu
e91paBgFBZ4CGG271zKpAkEAhV87kSvmdJ0vY6RM+Z4JrBVainAFxUhePKguJ2vZ
1YUNAMcF4Ol4MHv9rlJ5nHwfBg9ESnP2oNwfdOk0Ofrk3Q==
-----END RSA PRIVATE KEY-----
`;
//var app = express();
//app.set('port', (process.env.PORT));
//app.use(express.static(__dirname + '/public'));
//app.use((req, res, next) => {
//    res.header("Access-Control-Allow-Origin", '*');
//    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE')
//    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
//    next();
//});

//app.use(bodyParser.json({
//  extended: true
//}));
//app.use(bodyParser.urlencoded({
//    extended: true
//}));

const generateClaimset = function generateClaimset(line){
	var valueList = line.split(',');
	var claimset = {
		'sub': valueList[5],
		'given_name': valueList[0],
		'family_name': valueList[1],
		'email': valueList[2],
		'phone_number': valueList[3],
		'gender': valueList[4],
		'lp_sdes': [{
			'type': 'ctmrinfo',
			'info': {
				'cstatus': valueList[8], 
				'ctype': valueList[9],
				'balance': valueList[10],
				'companySize': valueList[11],
				'accountName': valueList[12],
				'role': valueList[13]
			}
		}]
	};
	return claimset;
};
//router.get('/signup', function(req, res){
router.get('/', function(req, res){
	var claims = {
		'sub': uuidv4()
	};
	var milliseconds = (new Date()).getTime();
	var seconds = milliseconds/1000 | 0;
	claims.iss = "https://www.google.com";
	claims.iat = milliseconds;
	claims.exp = milliseconds + 31540000000;
//  claims.sub = "dennisnoto@gmail.com"	
	jwt.sign(claims, privateKey, {algorithm: 'RS256'}, function(err, token){
		if(err){
			console.error('Error!!!', err);
			res.send({jwt: JSON.stringify(err), successful: false});
		}else{
			console.log(token);
			res.send({jwt: token, successful: true});
		}
	});
});

module.exports = router;
//var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
