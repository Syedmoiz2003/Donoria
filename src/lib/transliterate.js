export const transliterateToUrdu = async (text) => {
  if (!text.trim()) return text;
  
  try {
    const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=ur-t-i0-und&num=1`);
    const data = await response.json();
    
    if (data[0] === 'SUCCESS' && data[1] && data[1][0]) {
      return data[1][0][1][0] || text;
    }
    return text;
  } catch (error) {
    console.error('Transliteration error:', error);
    return text;
  }
};
