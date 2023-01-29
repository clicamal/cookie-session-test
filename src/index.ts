import express, { NextFunction, Request, Response } from 'express';
import cookieSession from 'cookie-session';

interface UserData { username: string, password: string };

const users = {
    list: <UserData[]>[],

    create(data: UserData) {
        this.list.push(data);

        return {
            id: this.list.length - 1,
            username: data.username,
            password: data.password
        }
    },

    findByUsername(username: string) {
        let result = null;

        for (let index = this.list.length - 1; index >= 0; index--) {
            let user = this.list[index];

            if (user?.username === username) {
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
}

let app = express();

app.get('/test', (req, res) => {
    res.end('OK');
});

// Authentication logic

app.use(express.json());

app.use(cookieSession({
    secret: 'SECRET',
    maxAge: 120000
}));

app.post('/register', async(req, res) => {
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
});

app.post('/authenticate', async(req, res, next) => {
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

    else next(new Error('Invalid username or password.'));
});

app.get('/session', async(req, res) => {
    res.json(req.session);
});

app.use(async(error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: error.message
    });
});

app.listen(3000, () => console.log('Server running...'));
