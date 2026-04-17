// API相关工具函数

// 解析Neta Art短链接，获取UUID
export const parseNietaShortLink = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    const finalUrl = response.url;
    const match = finalUrl.match(/character\/(\w+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('解析短链接失败:', error);
    return null;
  }
};

// 搜索角色或元素
export const searchCharacter = async (query: string): Promise<any> => {
  try {
    const response = await fetch('https://api.talesofai.com/v2/travel/parent-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keyword: query,
        page: 1,
        size: 10
      })
    });
    
    if (!response.ok) {
      throw new Error('搜索失败');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
};

// 生成二创图片
export const generateImage = async (token: string, prompt: string, imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.talesofai.com/v2/creation/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: prompt,
        reference_image: imageUrl,
        size: '1024x1024'
      })
    });
    
    if (!response.ok) {
      throw new Error('生成图片失败');
    }
    
    const data = await response.json();
    return data?.data?.image_url || null;
  } catch (error) {
    console.error('生成图片失败:', error);
    return null;
  }
};
