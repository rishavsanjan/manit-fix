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
    where: { id }
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


  if (filter === 'default') {
    posts = await prisma.posts.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            picture: true
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

export default app
