import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import url from 'url';
import helmet from 'helmet';

import router from './routes';

import mongoose from 'mongoose';
import Board from './models/Board';
import Admin from './models/Admin';

// import aws from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';

import expressErrorHandler from 'express-error-handler';

import herokuConfig from '../herokuConfig';

const app = express();
const port = 8083;
// const S3_BUCKET = herokuConfig.bucket;
//
// aws.config.update({
//     accessKeyId: herokuConfig.accessKeyId,
//     secretAccessKey: herokuConfig.secretAccessKey,
//     region: herokuConfig.region
// });
// const s3 = new aws.S3();

app.use(helmet());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});
mongoose.connect(herokuConfig.db);

app.use(cookieParser());
app.use(session({
    key: herokuConfig.sid,
    secret: herokuConfig.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use('/', express.static(path.join(__dirname, '../static')));

// const maxFileSize = 3 * 1024 * 1024;
// const upload = multer({
//     limits: {fileSize: maxFileSize},
//     storage: multerS3({
//         s3: s3,
//         bucket: S3_BUCKET,
//         metadata: (req, file, cb) => {
//             cb(null, {fieldname: file.fieldname});
//         },
//         key: (req, file, cb) => {
//             cb(null, Date.now().toString() + '.' + file.originalname.split('.')[file.originalname.split('.').length-1]);
//         }
//     })
// }).single('vfile');

app.use('/', router);

// app.get('/', (req, res) => {
//     req.app.render('join', (err, html) => {
//         if(err) throw err;
//         res.send(html);
//     });
// });

// app.get('/checkEmail', (req, res) => {
//     const { uemail } = req.query;
//
//     const verify = (email) => {
//         if(!email){
//             return '참여 가능한 이메일 입니다.';
//         }else{
//             throw new Error('이미 참여한 이메일 입니다.');
//         }
//     };
//
//     const respond = (msg) => {
//         res.json({
//             message: msg
//         });
//     };
//
//     const onError = (error) => {
//         res.status(403).json({
//             message: error.message
//         });
//     };
//
//     Board.findOneByEmail(uemail)
//           .then(verify)
//           .then(respond)
//           .catch(onError);
// });

// app.post('/registerVideo', (req, res) => {
//     upload(req, res, (err) => {
//         if(err){
//             return req.app.render('error', {message: '3MB 이하의 동영상 파일만 업로드 가능합니다'}, (err, html) => {
//                 if(err) throw err;
//                 res.send(html);
//             });
//         }
//
//         let { vurl, vname, vdesc, vorigin, ufirst, ulast, unation, ucity, ucountry, usns1, usns2, uemail, uvisit, upassport, uvisa, ucancel, uage, usex } = req.body;
//         let uname = ufirst + ' ' + ulast;
//         let usns = usns1;
//         if(typeof usns2 !== '') usns += ', ' + usns2
//
//         let file = req.file;
//         let vfile = '';
//
//         if(typeof file !== 'undefined'){
//             vfile = file.location;
//             vurl = '';
//         }else{
//             vfile = '';
//         }
//
//         const respond = () => {
//             res.redirect('/join/success');
//         };
//
//         const onError = (err) => {
//             console.error(err);
//         }
//
//         Board.create(vurl, vfile, vname, vdesc, vorigin, uname, unation, ucity, ucountry, usns, uemail, uvisit, upassport, uvisa, ucancel, uage, usex)
//              .then(respond)
//              .catch(onError);
//     });
// });
//
// app.get('/join/success', (req, res) => {
//     return req.app.render('success', (err, html) => {
//         if(err) throw err;
//         res.send(html);
//     });
// });

// app.use('/admin/lists', (req, res, next) => {
//     if(typeof req.session.user !== 'undefined' && req.session.user.admin){
//         next();
//     }else{
//         res.redirect('/admin');
//     }
// });
//
// app.get('/admin/lists', (req, res) => {
//     res.redirect('/admin/lists/1');
// });
//
// app.get('/admin/lists/:page', (req, res) => {
//     let page = parseInt(req.params.page, 10);
//     let {searchType, searchWord} = req.query;
//
//     let query = {};
//     if(typeof searchType !== 'undefined' && searchType !== ''){
//         switch(searchType.toUpperCase()){
//             case 'VNAME':
//             case 'VORIGIN':
//                 query[searchType] = {$regex: searchWord};
//                 break;
//             default:
//                 query[searchType] = searchWord;
//         }
//     }
//
//     let pagenation = null;
//
//     const getPagenation = (total) => {
//         pagenation = Board.getPagenation(page, total);
//
//         return Promise.resolve(false);
//     };
//
//     const getList = () => {
//         return Board.getList(query, pagenation);
//     };
//
//     const respond = (boards) => {
//         req.app.render('list', {
//             boards: boards,
//             pagenation: pagenation
//         },(err, html) => {
//             if(err) throw err;
//
//             res.send(html);
//         });
//     };
//
//     const onError = (err) => {
//         res.status(409).json({
//             success: false,
//             error: err,
//             message: err.message
//         });
//     };
//
//     Board.getTotal(query)
//          .then(getPagenation)
//          .then(getList)
//          .then(respond)
//          .catch(onError);
// });

// app.get('/admin', (req, res) => {
//     req.app.render('login', (err, html) => {
//         if(err) throw err;
//         res.send(html);
//     });
// });
//
// app.post('/admin/login', (req, res) => {
//     const { uid, upwd } = req.body;
//
//     let pagenation = null;
//
//     const verify = (admin) => {
//         if(!admin){
//             throw new Error('존재하지 않는 아이디 입니다.');
//         }else{
//             if(admin.verify(upwd)){
//                 req.session.user = {
//                     admin: true,
//                     id: uid
//                 };
//
//                 return true;
//             }else{
//                 throw new Error('비밀번호가 일치하지 않습니다.');
//             }
//         }
//     };
//
//     const respond = () => {
//         res.redirect('/admin/lists');
//     };
//
//     const onError = (error) => {
//         req.app.render('error', {message: error.message}, (err, html) => {
//             if(err) throw err;
//             res.send(html);
//         });
//     };
//
//     Admin.findOneById(uid)
//           .then(verify)
//           .then(respond)
//           .catch(onError);
// });
//
// app.get('/admin/logout', (req, res) => {
//     if(typeof req.session.user !== 'undefined'){
//         req.session.destroy((err) => {
//             if(err) throw err;
//             res.redirect('/admin');
//         });
//         res.clearCookie(herokuConfig.sid);
//     }else{
//         res.redirect('/admin');
//     }
// });

//todo
//인피니티 라이브

// app.post('/admin/account', (req, res) => {
//     let {uid, pwd} = req.body;
//
//     const respond = () => {
//         res.json({
//             message: '회원가입이 성공적으로 이뤄졌습니다.'
//         });
//     };
//
//     const onError = (error) => {
//         res.status(403).json({
//             message: error.message
//         });
//     }
//
//     Admin.create(uid, pwd)
//          .then(respond)
//          .catch(onError);
// });

const errorHandler = expressErrorHandler({
    static: {
        '404': path.join(__dirname, '../views/404.html')
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}.`);
});
