import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Post from '../../components/cards/Post'
import Link from 'next/link'
import { RollbackOutlined } from '@ant-design/icons'

const PostComments = () => {
    const [post,setPost]=useState({})
    const router = useRouter()
    const _id =router.query._id

    useEffect(() => {
        if(_id) fetchPost()
    }, [_id])

    const fetchPost = async() =>{
        try {
            const{data} = await axios.get(`/user-post/${_id}`)
            setPost(data)
        } catch (error) {
            console.log(error)
        }
    }

    const removeComment = async(postId,comment) =>{
        let answer =window.confirm('Are you sure to delete this comment?')
        if(!answer)return;
        try {
            const {data} =await axios.put('/remove-comment',{postId,comment})
            console.log('Comment removed',data)
            fetchPost()
        } catch (error) {
            console.log(error)
        }
    }

    return (
          

        <div className='container col-md-8 offset-md-2 pt-3'>
           <h4 className='text-center'>Comments</h4> 
           <div className='py-1 d-flex justify-content-start'>
        <Link href="/user/dashboard">
          <a className="btn btn-outline-secondary text-dark h4 ">
            <RollbackOutlined size={100} className='mb-1' />
          </a>
        </Link>
        </div>
            <Post post={post} commentsCount={100} removeComment={removeComment}/>
            <br/>
            <br/>
            <br/>
        </div>

        
    )
}

export default PostComments
