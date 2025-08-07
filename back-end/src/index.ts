import { Hono } from 'hono'
import { getPrisma } from './prismaFunction'
import { cors } from 'hono/cors'
import { sign } from 'hono/jwt'
import { authMiddleware } from './middleware'




const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE']
}))



const JWT_SECRET = 'rishav';

app.get('/hello', (c) => {
  return c.text('Hello from Hono + Cloudflare Workers!')
})



app.post('/google', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const { email, name, picture, sub } = await c.req.json();
  let user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        picture,
        googleId: sub
      }
    })
  }

  const token = await sign({ id: user.id, email: user.email }, JWT_SECRET);

  return c.json({
    message: 'Logged in',
    user, token
  })
})

app.use('/protected/*', authMiddleware);

app.get('/protected/profile', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id } = c.get('user');
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      Posts: true,
      Comment: {
        select: {
          post: {
            select: {
              user: {
                select: {
                  name: true,
                  id: true,
                  picture: true
                }
              },
              title: true,
              image: true,
              createdAt:true,
              id:true
            }
          },
          text: true,
          createdAt: true,
          parent: {
            select: {
              user: true,
              text: true,
              createdAt: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              picture: true
            }
          }
        }
      },
      Vote: {
        select: {
          post: true
        }
      }
    }
  })

  return c.json({ user })
})

app.post('/protected/upload-post', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { title, description, catogery, location, postPicUrl } = await c.req.json();
  const post = await prisma.posts.create({
    data: {
      userId, title, description, catogery, location, image: postPicUrl
    }
  })

  return c.json({ post })
})

app.get('/protected/getposts', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const skip = parseInt(c.req.query('skip') || '0');
  const take = parseInt(c.req.query('take') || '10');
  const filter = c.req.query('type');

  //@ts-ignore
  let posts = [];


  if (filter === 'All Issues') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Hostel') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'hostel'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Mess') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'mess'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Wi-Fi') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'wi-fi'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Academic') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'academic'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Pending') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        status: 'Pending'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Resolved') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        status: 'Resolved'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Transport') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'transport'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  }


  //@ts-ignore
  const postIds = posts.map(p => p.id);
  const votes = await prisma.vote.findMany({
    where: { postId: { in: postIds } },
    select: {
      postId: true,
      type: true,
      userId: true
    }
  })

  const voteMap: {
    [postId: string]: {
      upvote: number,
      downvote: number,
      userReaction: 'UpVote' | 'DownVote' | null
    }
  } = {};

  //@ts-ignore
  for (const post of posts) {
    voteMap[post.id] = { upvote: 0, downvote: 0, userReaction: null }
  }

  for (const r of votes) {
    if (r.type === 'UpVote') voteMap[r.postId].upvote++
    if (r.type === 'DownVote') voteMap[r.postId].downvote++
    if (r.userId === userId) voteMap[r.postId].userReaction = r.type
  }

  //@ts-ignore
  const response = posts.map(post => ({
    ...post,
    votes: voteMap[post.id]
  }))



  //@ts-ignore
  return c.json({ posts, votes, response })
})

app.get('/getposts', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const skip = parseInt(c.req.query('skip') || '0');
  const take = parseInt(c.req.query('take') || '10');
  const filter = c.req.query('type');

  //@ts-ignore
  let posts = [];


  if (filter === 'All Issues') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Hostel') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'hostel'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Mess') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'mess'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Wi-Fi') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'wi-fi'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Academic') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'academic'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Pending') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        status: 'Pending'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Resolved') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        status: 'Resolved'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  } else if (filter === 'Transport') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      where: {
        catogery: 'transport'
      },
      include: {
        user: {
          select: {
            name: true,
            picture: true
          }
        },
        Comment: {
          select: {
            id: true
          }
        }
      }
    })
  }


  //@ts-ignore
  const postIds = posts.map(p => p.id);
  const votes = await prisma.vote.findMany({
    where: { postId: { in: postIds } },
    select: {
      postId: true,
      type: true,
      userId: true
    }
  })

  const voteMap: {
    [postId: string]: {
      upvote: number,
      downvote: number,
    }
  } = {};

  //@ts-ignore
  for (const post of posts) {
    voteMap[post.id] = { upvote: 0, downvote: 0 }
  }

  for (const r of votes) {
    if (r.type === 'UpVote') voteMap[r.postId].upvote++
    if (r.type === 'DownVote') voteMap[r.postId].downvote++
  }

  //@ts-ignore
  const response = posts.map(post => ({
    ...post,
    votes: voteMap[post.id]
  }))



  //@ts-ignore
  return c.json({ posts, votes, response })
})

app.post('/protected/addvote', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { vote, postId } = await c.req.json();

  const addVote = await prisma.vote.create({
    data: {
      postId, userId, type: vote
    }
  })

  return c.json({ addVote })
})

app.put('/protected/updatevote', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { vote, postId } = await c.req.json();

  const updateVote = await prisma.vote.update({
    where: {
      postId_userId: {
        postId,
        userId
      }
    },
    data: {
      type: vote
    }
  })

  return c.json({ updateVote })
})



app.delete('/protected/removevote', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { postId } = await c.req.json();

  const deleteVote = await prisma.vote.delete({
    where: {
      postId_userId: {
        postId,
        userId
      }
    }
  })

  return c.json({ deleteVote })
})

app.get('/protected/postdetail/:postId', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const id = c.req.param('postId');

  const post = await prisma.posts.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          picture: true
        }
      },
      Comment: {
        select: {
          userId: true,
          id: true,
          text: true,
          parentId: true,
          replies: true,
          createdAt:true,
          CommentReactions: {
            select: {
              userId: true,
              type: true,
              commentId: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              picture: true
            }
          }
        }
      }
    }
  })

  const votes = await prisma.vote.findMany({
    where: {
      postId: id
    },
    select: {
      postId: true,
      type: true,
      userId: true
    }
  })

  let voteMap: {
    upvote: number;
    downvote: number;
    userReaction: 'UpVote' | 'DownVote' | null;
  }

  voteMap = { upvote: 0, downvote: 0, userReaction: null }
  for (const r of votes) {
    if (r.type === 'UpVote') voteMap.upvote += 1;
    if (r.type === 'DownVote') voteMap.downvote += 1;
    if (r.userId === userId) voteMap.userReaction = r.type;
  }




  const response = {
    ...post,
    vote: voteMap
  }

  return c.json({ response, userId })

})

app.get('/postdetail/:postId', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param('postId');

  const post = await prisma.posts.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          picture: true
        }
      },
      Comment: {
        select: {
          userId: true,
          id: true,
          text: true,
          parentId: true,
          replies: true,
          createdAt:true,
          CommentReactions: {
            select: {
              userId: true,
              type: true,
              commentId: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              picture: true
            }
          }
        }
      }
    }
  })

  const votes = await prisma.vote.findMany({
    where: {
      postId: id
    },
    select: {
      postId: true,
      type: true,
      userId: true
    }
  })

  let voteMap: {
    upvote: number;
    downvote: number;
  }

  voteMap = { upvote: 0, downvote: 0 }
  for (const r of votes) {
    if (r.type === 'UpVote') voteMap.upvote += 1;
    if (r.type === 'DownVote') voteMap.downvote += 1;
  }




  const response = {
    ...post,
    vote: voteMap
  }

  return c.json({ response })

})

app.post('/protected/addcomment', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { comment, postId } = await c.req.json();
  const addcomment = await prisma.comment.create({
    data: {
      postId, userId, text: comment
    },

  })

  const fullComment = await prisma.comment.findUnique({
    where: {
      id: addcomment.id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          picture: true
        }
      },
      replies: true,
      CommentReactions: {
        select: {
          userId: true,
          type: true,
          commentId: true
        }
      },
    },

  })

  return c.json({ fullComment });
})

app.post('/protected/addreplyto', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { replyText, postId, parentId } = await c.req.json();
  const addReply = await prisma.comment.create({
    data: {
      text: replyText, postId, userId, parentId
    }
  })

  return c.json({ addReply })

})

app.post('/protected/getreplies', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');

  const { postId, parentId } = await c.req.json();
  const replies = await prisma.comment.findMany({
    where: {
      parentId
    },
    include: {
      replies: true,
      user: {
        select: {
          name: true,
          id: true,
          picture: true
        }
      },
      CommentReactions: {
        select: {
          userId: true,
          type: true,
          commentId: true
        }
      },
    }
  })

  return c.json({ replies, })

})

app.post('/getreplies', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore

  const { postId, parentId } = await c.req.json();
  const replies = await prisma.comment.findMany({
    where: {
      parentId
    },
    include: {
      replies: true,
      user: {
        select: {
          name: true,
          id: true,
          picture: true
        }
      },
      CommentReactions: {
        select: {
          userId: true,
          type: true,
          commentId: true
        }
      },
    }
  })

  return c.json({ replies, })

})

app.post('/protected/likecomment', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');

  const { commentId, postId } = await c.req.json();

  const addLike = await prisma.commentReactions.create({
    data: {
      commentId, userId, type: 'like', postId
    }
  })

  return c.json({ addLike })

})

app.post('/protected/removelike', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');

  const { commentId } = await c.req.json();

  const removelike = await prisma.commentReactions.delete({
    where: {
      commentId_userId: {
        commentId,
        userId
      }
    }
  })

  return c.json({ removelike })

})

app.post('/protected/update-profile', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  //@ts-ignore
  const { id: userId } = c.get('user');
  const { department, picture } = await c.req.json();
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      department, picture
    }
  })

  return c.json({ updatedUser })
})


export default app
