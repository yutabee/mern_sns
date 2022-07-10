const router = require('express').Router();
const User = require('../models/User');


// router.get('/', (req, res) => {
//     res.send('user router');
// });

//CRUD
//ユーザー情報の更新
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body,   //全部書き換えるって意味
            });  
            res.status(200).json('ユーザー情報が更新されました');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('自分のアカウント情報しか更新できません');
    }
});

//ユーザー情報の削除
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);  
            res.status(200).json('ユーザー情報が削除されました');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('自分のアカウント情報しか削除できません');
    }
});

//ユーザー情報の取得
//第三者もツイート情報を取得するためifは不要
// router.get('/:id', async (req, res) => {
//         try {
//             const user = await User.findById(req.params.id);  //queryのidと一致するユーザー情報を取得
//             const { password, updatedAt, ...other } = user._doc;  //パスワードと更新日時はみられてはいけないので分割代入して取り除く
//             return res.status(200).json(other);
//         } catch (err) {
//             return res.status(500).json(err);
//         }
// });

//クエリを使ってユーザー情報を取得
router.get('/', async (req, res) => {
    const userId = req.query.userId;   //クエリ情報を取得する
    const username = req.query.username;

    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });

            const { password, updatedAt, ...other } = user._doc;  //パスワードと更新日時はみられてはいけないので分割代入して取り除く
            return res.status(200).json(other);
        } catch (err) {
            return res.status(500).json(err);
        }
});

//ユーザーのフォロー
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id){  //自分以外はフォローできない
        try {
            const user = await User.findById(req.params.id);  //reqがきたユーザー
            const currentUser = await User.findById(req.body.userId); //ログインしているユーザー

            if (!user.followers.includes(req.body.userId)) {  //フォロワーに自分がいなければフォローできる  user.followersは配列なのでincludes関数が使用できる
                await user.updateOne({
                    $push: {        //配列にuserIdをpush
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $push: {        //followingsにpush
                        followings: req.params.id,
                    },
                });
                return res.status(200).json('フォローに成功しました');

            } else {
                return res.status(403).json('あなたはすでにこのユーザをフォローしています')
            }

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json('自分自身をフォローできません');
   } 
});


//ユーザーのフォローを外す
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id){  
        try {
            const user = await User.findById(req.params.id);  
            const currentUser = await User.findById(req.body.userId); 

            if (user.followers.includes(req.body.userId)) {  //フォロワーに自分が存在していればフォローを外せる（フォローと逆）
                await user.updateOne({
                    $pull: {        //配列から取り除く
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $pull: {        //配列から取り除く
                        followings: req.params.id,
                    },
                });
                return res.status(200).json('フォロー解除しました');

            } else {
                return res.status(403).json('このユーザーはフォロー解除できません')
            }

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json('自分自身をフォロー解除できません');
   } 
});



module.exports = router;