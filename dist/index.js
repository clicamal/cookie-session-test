"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
;
const users = {
    list: [],
    create(data) {
        this.list.push(data);
        return {
            id: this.list.length - 1,
            username: data.username,
            password: data.password
        };
    },
    findByUsername(username) {
        let result = null;
        for (let index = this.list.length - 1; index >= 0; index--) {
            let user = this.list[index];
            if ((user === null || user === void 0 ? void 0 : user.username) === username) {
                result = {
                    id: index,
                    username: user.username,
                    password: user.password
                };
                break;
            }
        }
        return result;
    }
};
let app = (0, express_1.default)();
app.get('/test', (req, res) => {
    res.end('OK');
});
// Authentication logic
app.use(express_1.default.json());
app.use((0, cookie_session_1.default)({
    secret: 'SECRET',
    maxAge: 120000
}));
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    let user = users.create({ username, password });
    req.session = {
        user: {
            id: user.id,
            username: user.username,
            password: user.password
        }
    };
    res.json({
        message: 'User created successfully.'
    });
}));
app.post('/authenticate', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    let user = users.findByUsername(username);
    if (user && user.password === password) {
        req.session = {
            user: {
                id: user.id,
                username: user.username,
                password: user.password
            }
        };
        res.json({
            message: 'User authenticated successfully.'
        });
    }
    else
        next(new Error('Invalid username or password.'));
}));
app.get('/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.session);
}));
app.use((error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(500).json({
        message: error.message
    });
}));
app.listen(3000, () => console.log('Server running...'));
