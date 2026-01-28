export default defineEventHandler(async (event) => {
  // 模拟画师数据 - 使用本地示例头像
  return [
    {
      id: '1',
      display_name: '小雨画师',
      avatar_url: '/artist-1.jpg',
      bio: '专业插画师，擅长角色设计和场景绘制，5年从业经验',
      status: 'ready',
      rating: 4.9,
      total_sales: 156,
      base_price: 200,
      tags: ['日系', '二次元', '角色设计'],
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      display_name: '星空绘者',
      avatar_url: '/artist-2.jpg',
      bio: '二次元风格专家，精通人物立绘和Q版设计',
      status: 'busy',
      rating: 4.8,
      total_sales: 203,
      base_price: 150,
      tags: ['二次元', 'Q版', '立绘'],
      created_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      display_name: '墨染青花',
      avatar_url: '/artist-3.jpg',
      bio: '古风插画师，擅长水墨风格和传统文化题材',
      status: 'ready',
      rating: 4.9,
      total_sales: 89,
      base_price: 300,
      tags: ['国风', '水墨', '传统'],
      created_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '4',
      display_name: '像素大师',
      avatar_url: '/artist-4.jpg',
      bio: '像素艺术专家，游戏美术设计师',
      status: 'offline',
      rating: 4.7,
      total_sales: 67,
      base_price: 100,
      tags: ['像素', '游戏', '复古'],
      created_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '5',
      display_name: '色彩魔法师',
      avatar_url: '/artist-5.jpg',
      bio: '色彩搭配专家，擅长创造梦幻般的视觉效果',
      status: 'ready',
      rating: 4.8,
      total_sales: 134,
      base_price: 250,
      tags: ['色彩', '梦幻', '视觉'],
      created_at: '2024-01-12T00:00:00Z'
    },
    {
      id: '6',
      display_name: '线条诗人',
      avatar_url: '/artist-6.jpg',
      bio: '线条艺术大师，用简洁的线条表达深刻的情感',
      status: 'ready',
      rating: 4.6,
      total_sales: 78,
      base_price: 180,
      tags: ['线条', '简约', '情感'],
      created_at: '2024-01-08T00:00:00Z'
    }
  ]
})