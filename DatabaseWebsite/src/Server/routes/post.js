//const { isAuthenticated } = require("../middlewares/auth");
const { createPost, updatePost, likesHandle, addComment, deleteComment, save, updateComment, deletePost, getPost, userPosts, explore, savedPosts, homePosts } = require("../controllers/post");

const router = require("express").Router();

router.route('/:postId').get(getPost)

router.route("/create").post(createPost);

router.route("/update/:postId").put(updatePost);

router.route("/userpost/:userId").get(userPosts)

router.route("/handlelike/:postId").put(likesHandle);

router.route("/addcomment/:postId").post(addComment).put(updateComment)

router.route("/removecomment/:postId").delete(deleteComment);

router.route("/handlesave/:postId").get(save);

router.route("/delete/:postId").delete(deletePost)

router.route("/get/explore").get(explore)

router.route("/get/saved").get(savedPosts)

router.route("/get/home").get(homePosts)


module.exports = router;
