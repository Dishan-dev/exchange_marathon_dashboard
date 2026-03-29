'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Text, Group, Circle, Rect } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

interface RecapCanvasProps {
  cardId: string;
  stats: any;
  customPhoto?: string;
  teamColor: string;
  width?: number;
  height?: number;
  onExport?: (dataUrl: string) => void;
}

export const RecapCanvas = React.forwardRef<Konva.Stage, RecapCanvasProps>(({ 
  cardId, 
  stats, 
  customPhoto, 
  teamColor, 
  width = 1080, 
  height = 1920,
  onExport 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalStageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });

  // Expose the stage ref correctly
  React.useImperativeHandle(ref, () => internalStageRef.current!);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        const scale = Math.min(offsetWidth / width, offsetHeight / height);
        setDimensions({ 
          width: width * scale, 
          height: height * scale, 
          scale: scale 
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  const [bgImage] = useImage('/flyer-bg.png', 'anonymous');
  const [logoBase] = useImage('/logo.png', 'anonymous');
  const [performerImage] = useImage(customPhoto || '', 'anonymous');
  const [flagMascot] = useImage('/mascot/flag.png', 'anonymous');
  const [laptopMascot] = useImage('/mascot/laptop.png', 'anonymous');
  
  const [resolvedColor, setResolvedColor] = useState('#FFD700');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (teamColor.startsWith('var(')) {
        const varName = teamColor.slice(4, -1);
        const color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        if (color) {
          setResolvedColor(color);
          return;
        }
      }
      setResolvedColor(teamColor);
    }
  }, [teamColor]);
  
  // Photo positioning state (for drag/scale)
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0, scale: 1 });

  // Center the performer photo by default
  useEffect(() => {
    if (performerImage) {
      const centerX = width / 2;
      const centerY = height * 0.42; // Position of the circle center
      setPhotoPos({ 
        x: centerX, 
        y: centerY, 
        scale: Math.max(260 / performerImage.width, 260 / performerImage.height) * 1.5
      });
    }
  }, [performerImage, width, height]);

  const isPerformer = cardId.includes('performer');
  const isTeam = cardId === 'best-team';
  const isSnapshot = cardId === 'weekly-snapshot';

  // Performer specific data
  const performer = cardId === 'best-performer-tl' ? stats.teamAce : stats.globalMvp;
  const performerTitle = cardId === 'best-performer-tl' ? 'TEAM LEADER' : 'MEMBER';

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-black/20 overflow-hidden relative">
      <div style={{ 
        transform: `scale(${dimensions.scale})`, 
        transformOrigin: 'center center',
        width: width,
        height: height,
        position: 'absolute'
      }}>
        <Stage 
          width={width} 
          height={height} 
          ref={internalStageRef}
          className="shadow-2xl"
        >
          <Layer>
            {/* 1. Background Image */}
            {bgImage && (
              <Image 
                image={bgImage} 
                width={width} 
                height={height} 
                onContextMenu={(e) => e.evt.preventDefault()}
              />
            )}

            {/* 2. Logo Header */}
            {logoBase && (
              <Image 
                image={logoBase} 
                x={width / 2} 
                y={160}
                width={200}
                height={200 * (logoBase.height / logoBase.width)}
                offsetX={100}
                offsetY={(200 * (logoBase.height / logoBase.width)) / 2}
                opacity={0.8}
              />
            )}

          {/* 3. Snapshot Card */}
          {isSnapshot && (
            <Group>
               <Group x={width / 2} y={height * 0.4}>
                 {/* Mascot Glow */}
                 <Circle 
                   radius={300} 
                   fillRadialGradientStartPoint={{x:0, y:0}} 
                   fillRadialGradientStartRadius={0} 
                   fillRadialGradientEndPoint={{x:0, y:0}} 
                   fillRadialGradientEndRadius={300} 
                   fillRadialGradientColorStops={[0, resolvedColor, 1, 'transparent']} 
                   opacity={0.25}
                 />
                 {flagMascot && (
                   <Image 
                     image={flagMascot} 
                     width={600} 
                     height={600} 
                     offsetX={300} 
                     offsetY={300} 
                     shadowColor={resolvedColor}
                     shadowBlur={100}
                     shadowOpacity={0.2}
                   />
                 )}
               </Group>
               
               <Group y={400}>
                  <Text 
                    text="WEEK 01 SNAPSHOT" 
                    x={0} 
                    y={800} 
                    width={width} 
                    align="center" 
                    fontSize={36} 
                    fontStyle="900" 
                    fill="#FFD700" 
                    opacity={0.9} 
                    letterSpacing={15}
                  />
                  <Text 
                    text={(stats.currentTeamName + " RECAP").toUpperCase()} 
                    x={0} 
                    y={880} 
                    width={width} 
                    align="center" 
                    fontSize={110} 
                    fontStyle="900 italic" 
                    fill="white" 
                    lineHeight={1.1}
                    letterSpacing={-4}
                  />
               </Group>
            </Group>
          )}

          {/* 4. Best Team Card */}
          {isTeam && (
            <Group>
               <Text 
                 text={stats.topTeam.name.split(' ')[0].toUpperCase()} 
                 x={0} 
                 y={height / 2 - 100} 
                 width={width} 
                 align="center" 
                 fontSize={500} 
                 fontStyle="900 italic" 
                 fill="white" 
                 opacity={0.03}
                 letterSpacing={20}
               />
               <Group y={height / 2 - 200}>
                  <Text 
                    text="BEST PERFORMING TEAM" 
                    x={0} 
                    y={0} 
                    width={width} 
                    align="center" 
                    fontSize={36} 
                    fontStyle="900" 
                    fill="white" 
                    opacity={0.9} 
                    letterSpacing={12}
                  />
                  <Text 
                    text={stats.topTeam.name.toUpperCase()} 
                    x={0} 
                    y={80} 
                    width={width} 
                    align="center" 
                    fontSize={130} 
                    fontStyle="900 italic" 
                    fill="white" 
                    lineHeight={1.1}
                    letterSpacing={-4}
                  />
                  
                  {/* Points Box */}
                  <Group x={width / 2 - 180} y={320}>
                    <Rect 
                      width={360} 
                      height={120} 
                      fill="rgba(255,255,255,0.05)" 
                      cornerRadius={60} 
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth={2}
                    />
                    <Text 
                      text={stats.topTeam.points.toString()} 
                      x={40} 
                      y={20} 
                      fontSize={80} 
                      fontStyle="900 italic" 
                      fill="#FFD700" 
                    />
                    <Text 
                      text="PTS" 
                      x={210} 
                      y={45} 
                      fontSize={32} 
                      fontStyle="900 italic" 
                      fill="rgba(255,255,255,0.6)" 
                      letterSpacing={5}
                    />
                  </Group>
               </Group>

               {/* Laptop Mascot at bottom right */}
               {laptopMascot && (
                 <Image 
                   image={laptopMascot} 
                   x={width - 50} 
                   y={height - 50} 
                   width={560} 
                   height={560} 
                   offsetX={560} 
                   offsetY={560}
                   shadowColor={resolvedColor}
                   shadowBlur={80}
                   shadowOpacity={0.2}
                 />
               )}
            </Group>
          )}

          {/* 5. Performer Cards */}
          {isPerformer && (
            <Group>
              <Text 
                text="BEST PERFORMER" 
                x={0} 
                y={280} 
                width={width} 
                align="center" 
                fontSize={32} 
                fontStyle="900" 
                fill="#FFD700" 
                opacity={0.9} 
                letterSpacing={15}
              />

              {/* Profile Photo Circle */}
              <Group x={width / 2} y={height * 0.42}>
                {/* Outer Glow */}
                <Circle radius={360} fillRadialGradientStartPoint={{x:0, y:0}} fillRadialGradientStartRadius={280} fillRadialGradientEndPoint={{x:0, y:0}} fillRadialGradientEndRadius={360} fillRadialGradientColorStops={[0, 'rgba(255,215,0,0.05)', 1, 'transparent']} />
                
                {/* Border */}
                <Circle 
                  radius={300} 
                  stroke="#FFD700" 
                  strokeWidth={15} 
                  opacity={0.15} 
                />

                {/* Masked Photo */}
                <Group clipFunc={(ctx) => ctx.arc(0, 0, 290, 0, Math.PI * 2, false)}>
                  <Rect x={-300} y={-300} width={600} height={600} fill="rgba(255,255,255,0.1)" />
                  {performerImage ? (
                    <Image 
                      image={performerImage}
                      x={photoPos.x - width/2}
                      y={photoPos.y - height * 0.42}
                      scaleX={photoPos.scale}
                      scaleY={photoPos.scale}
                      offsetX={performerImage.width / 2}
                      offsetY={performerImage.height / 2}
                      draggable
                      onDragEnd={(e) => {
                         setPhotoPos(p => ({ ...p, x: e.target.x() + width/2, y: e.target.y() + height * 0.42 }));
                      }}
                      onWheel={(e) => {
                        e.evt.preventDefault();
                        const scaleBy = 1.1;
                        const direction = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
                        setPhotoPos(p => ({
                          ...p,
                          scale: Math.max(0.1, Math.min(5, p.scale * direction))
                        }));
                      }}
                    />
                  ) : (
                    <Text 
                       text={performer?.avatar || "👤"}
                       fontSize={300}
                       x={-150}
                       y={-150}
                       width={300}
                       align="center"
                       opacity={0.8}
                    />
                  )}
                </Group>
              </Group>

              {/* Performer Details Group */}
              <Group y={height * 0.68}>
                <Text 
                  text={stats.currentTeamName.toUpperCase()} 
                  x={0} 
                  y={0} 
                  width={width} 
                  align="center" 
                  fontSize={40} 
                  fontStyle="900" 
                  fill="#FFD700" 
                  opacity={0.8} 
                  letterSpacing={10}
                />
                <Rect x={width/2 - 200} y={50} width={400} height={2} fill="rgba(255,215,0,0.2)" />
                
                <Text 
                  text={(performer?.name || "Member Name").toUpperCase()} 
                  x={0} 
                  y={120} 
                  width={width} 
                  align="center" 
                  fontSize={110} 
                  fontStyle="900 italic" 
                  fill="white" 
                  letterSpacing={-4}
                />
                
                {/* Title Line */}
                <Group y={340}>
                   <Rect x={width/2 - 400} y={0} width={800} height={2} fill="rgba(255,255,255,0.1)" />
                   <Text 
                     text={performerTitle} 
                     x={0} 
                     y={60} 
                     width={width} 
                     align="center" 
                     fontSize={36} 
                     fontStyle="900" 
                     fill="white" 
                     opacity={0.3} 
                     letterSpacing={15}
                   />
                </Group>
              </Group>
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  </div>
);
});

export default RecapCanvas;
