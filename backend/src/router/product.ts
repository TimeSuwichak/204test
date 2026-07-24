import http from "#core/http.ts";
import control from "#controller/product.ts"
import controlAuth from "#controller/auth.ts";

const content = () =>
{
    return;
}
content.getRoute = () =>
{
    const router = http.router ();
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/", control.getBasicList);
    router.get ("/:id", control.getBasic);
    router.put ("/:id", authManager, control.putBasic);
    router.post ("/", authManager, control.postBasic);
    router.delete ("/:id", authManager, control.deleteBasic);
   
    return router;
}
content.getRouteCategory = () =>
{
    const router = http.router ();
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/:id", control.getCategory);
    router.put ("/:id", authManager, control.putCategory);
    router.post ("/", authManager, control.postCategory);
    router.delete ("/:id", authManager, control.deleteCategory);

    return router;
}
content.getRouteComment = () =>
{
    const router = http.router ();
    const auth = controlAuth.validateLeastUser ();

    router.get ("/:id", control.getComment);
    router.put ("/:id", auth, control.putComment);
    router.post ("/", auth, control.postComment);
    router.delete ("/:id", auth, control.deleteComment);

    return router;
}
content.getRouteCommentList = () =>
{
    const router = http.router ();

    router.get ("/:id", control.getCommentList);

    return router;
}
content.getRouteReview = () =>
{
    const router = http.router ();
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/:id", control.getReview);
    router.put ("/:id", authManager, control.putReview);
    router.post ("/", authManager, control.postReview);
    router.delete ("/:id", authManager, control.deleteReview);

    return router;
}
content.getRouteReviewList = () =>
{
    const router = http.router ();

    router.get ("/:id", control.getReviewList);

    return router;
}
content.getRouteStock = () =>
{
    const router = http.router ();
    const authStaff = controlAuth.validateLeastStaff ();

    router.get ("/:id", authStaff, control.getStock);
    router.put ("/:id", authStaff, control.putStock);

    return router;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;