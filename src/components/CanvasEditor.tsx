import { useRef, useEffect, useState } from 'react';

interface CanvasEditorProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  onImageUpdate: (imageData: string) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  imageUrl,
  topText,
  bottomText,
  onImageUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 设置Canvas尺寸
      const aspectRatio = img.width / img.height;
      const containerWidth = 600;
      const containerHeight = containerWidth / aspectRatio;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // 绘制图片
      ctx.drawImage(img, 0, 0, containerWidth, containerHeight);

      // 绘制顶部文字
      if (topText) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // 文字换行
        const lines = topText.split('\n');
        lines.forEach((line, index) => {
          ctx.strokeText(line, containerWidth / 2, 20 + index * 40);
          ctx.fillText(line, containerWidth / 2, 20 + index * 40);
        });
      }

      // 绘制底部文字
      if (bottomText) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // 文字换行
        const lines = bottomText.split('\n');
        lines.forEach((line, index) => {
          ctx.strokeText(line, containerWidth / 2, containerHeight - 20 - index * 40);
          ctx.fillText(line, containerWidth / 2, containerHeight - 20 - index * 40);
        });
      }

      // 通知父组件图片已更新
      const imageData = canvas.toDataURL('image/png');
      onImageUpdate(imageData);

      setIsLoaded(true);
    };
    img.src = imageUrl;

    return () => {
      // 清理
    };
  }, [imageUrl, topText, bottomText, onImageUpdate]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-xl"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white bg-black/60 px-6 py-3 rounded-lg font-medium">
            加载中...
          </span>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
