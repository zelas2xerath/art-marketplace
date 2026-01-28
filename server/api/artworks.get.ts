export default defineEventHandler(async (event) => {
  // 模拟作品数据 - 使用本地示例图片
  return [
    {
      id: '1',
      title: '梦幻少女',
      description: '唯美二次元少女插画，细腻的光影效果',
      image_url: '/artwork-1.jpg',
      like_count: 234,
      view_count: 1520,
      category: 'illustration',
      tags: ['二次元', '少女', '梦幻'],
      artist: {
        id: '1',
        display_name: '小雨画师',
        avatar_url: '/artist-1.jpg'
      },
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: '古风美人',
      description: '传统水墨风格人物画，意境深远',
      image_url: '/artwork-2.jpg',
      like_count: 189,
      view_count: 980,
      category: 'portrait',
      tags: ['古风', '水墨', '美人'],
      artist: {
        id: '3',
        display_name: '墨染青花',
        avatar_url: '/artist-3.jpg'
      },
      created_at: '2024-01-18T00:00:00Z'
    },
    {
      id: '3',
      title: '科幻战士',
      description: '未来科技风格角色设计，机甲元素丰富',
      image_url: '/artwork-3.jpg',
      like_count: 156,
      view_count: 756,
      category: 'character',
      tags: ['科幻', '机甲', '战士'],
      artist: {
        id: '2',
        display_name: '星空绘者',
        avatar_url: '/artist-2.jpg'
      },
      created_at: '2024-01-12T00:00:00Z'
    },
    {
      id: '4',
      title: '像素冒险',
      description: '复古像素风格游戏场景，怀旧感十足',
      image_url: '/artwork-4.jpg',
      like_count: 98,
      view_count: 445,
      category: 'scene',
      tags: ['像素', '复古', '游戏'],
      artist: {
        id: '4',
        display_name: '像素大师',
        avatar_url: '/artist-4.jpg'
      },
      created_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '5',
      title: '魔法森林',
      description: '神秘的魔法森林场景，充满奇幻色彩',
      image_url: '/artwork-5.jpg',
      like_count: 267,
      view_count: 1234,
      category: 'scene',
      tags: ['魔法', '森林', '奇幻'],
      artist: {
        id: '5',
        display_name: '色彩魔法师',
        avatar_url: '/artist-5.jpg'
      },
      created_at: '2024-01-14T00:00:00Z'
    },
    {
      id: '6',
      title: '都市夜景',
      description: '现代都市的霓虹夜景，线条简洁有力',
      image_url: '/artwork-6.jpg',
      like_count: 145,
      view_count: 678,
      category: 'scene',
      tags: ['都市', '夜景', '现代'],
      artist: {
        id: '6',
        display_name: '线条诗人',
        avatar_url: '/artist-6.jpg'
      },
      created_at: '2024-01-16T00:00:00Z'
    },
    {
      id: '7',
      title: '可爱Q版角色',
      description: 'Q版风格的可爱角色设计，表情生动',
      image_url: '/artwork-7.jpg',
      like_count: 312,
      view_count: 1567,
      category: 'chibi',
      tags: ['Q版', '可爱', '角色'],
      artist: {
        id: '2',
        display_name: '星空绘者',
        avatar_url: '/artist-2.jpg'
      },
      created_at: '2024-01-11T00:00:00Z'
    },
    {
      id: '8',
      title: '抽象艺术',
      description: '现代抽象艺术作品，色彩丰富层次分明',
      image_url: '/artwork-8.jpg',
      like_count: 89,
      view_count: 423,
      category: 'illustration',
      tags: ['抽象', '现代', '艺术'],
      artist: {
        id: '5',
        display_name: '色彩魔法师',
        avatar_url: '/artist-5.jpg'
      },
      created_at: '2024-01-13T00:00:00Z'
    }
  ]
})