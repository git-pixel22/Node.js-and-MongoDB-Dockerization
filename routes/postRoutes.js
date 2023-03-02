const eexpress = require("express");

const postController = require("../controllers/postController");

const router = express.Router();


//localhost:3000/
router
    .router("/")
    .get(postController.getAllPosts)
    .post(postController.createPost);

router
    .route("/:id")
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);

module.exports = router;