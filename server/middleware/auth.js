export const protect =async (req, res, next) => {
    try{
        const auth = await req.auth();
        const{userId}= auth;
        if(!userId){
            console.log('No userId found. Auth object:', auth);
            return res.json({success:false, message:'Not authorized'})
        }
        req.userId = userId;
        next();
    }catch(error){
        console.log('Auth error:', error.message);
        return res.json({success:false, message:error.message})
    }
}