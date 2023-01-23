// SUNUCUYU BU DOSYAYA KURUN
const express = require("express");
const User = require("./users/model")
const server = express();
server.use(express.json())
server.post("/api/users", (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio){
        res.status(400).json({
            message: "Lütfen kullanıcı için bir name ve bio sağlayın"
        })
    } else {
        User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch(err =>{
            res.status(500).json({
                message: "Veritabanına kaydedilirken bir hata oluştu"
            })
        })
    }
})
server.get("/api/users", (req,res) => {
    User.find()
    .then(users => {
        res.json(users)
    }).catch(err =>{
        res.status(500).json({
            message: "Kullanıcı bilgileri alınamadı"
        })
    })
})
server.get("/api/users/:id", (req,res) => {
        User.findById(req.params.id)
        .then(user =>{
            if(!user){
                res.status(404).json({
                    message: "Belirtilen ID'li kullanıcı bulunamadı"
                })
            }
            res.status(200).json(user)
        })
    .catch(err =>{
        res.status(500).json({
            message: "Kullanıcı bilgileri alınamadı"
        });
    });
})


server.delete("/api/users/:id", async (req,res) => {
    const possibleUser = await User.findById(req.params.id)
    if(!possibleUser) {
        res.status(404).json({
            message: "Belirtilen ID'li kullanıcı bulunamadı"
        })
    } else {
        const deleteUser = await User.remove(req.params.id)
        res.status(200).json(deleteUser)
    }
})


server.put("/api/users/:id", async (req,res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser){
            res.status(404).json({
                message: "Belirtilen ID'li kullanıcı bulunamadı"
            })
        } else {
            if(!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: "Lütfen kullanıcı için name ve bio sağlayın"
                })
            } else {
                const updatedUser = await User.update(
                    req.params.id,
                    req.body
                )
                res.status(200).json(updatedUser)
            }
        }

    } catch (err) {
        res.status(500).json({
            message: "Kullanıcı bilgileri güncellenemedi"
        })
    }
})


module.exports = server; // SERVERINIZI EXPORT EDİN {}
