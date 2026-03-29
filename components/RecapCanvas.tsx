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
  photoPos?: { x: number, y: number, scale: number };
  onPhotoPosChange?: (pos: { x: number, y: number, scale: number }) => void;
  topPerformers?: any[];
}

export const RecapCanvas = React.forwardRef<Konva.Stage, RecapCanvasProps>(({ 
  cardId, 
  stats, 
  customPhoto, 
  teamColor, 
  width = 1080, 
  height = 1920,
  onExport,
  photoPos: propPhotoPos,
  onPhotoPosChange,
  topPerformers = []
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
  const [performerImage, imageStatus] = useImage(customPhoto || '');
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
        scale: Math.max(600 / performerImage.width, 600 / performerImage.height)
      });
    }
  }, [performerImage, width, height]);

  const isPerformer = cardId.includes('performer');
  const isTeam = cardId === 'best-team';
  const isSnapshot = cardId === 'weekly-snapshot';

  // Week calculation
  const startDate = new Date("2026-03-29");
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const currentWeekNum = Math.floor(diffDays / 7) + 1;
  const weekLabel = `WEEK ${currentWeekNum.toString().padStart(2, '0')}`;

  // Performer specific data
  const performer = cardId === 'best-performer-tl' ? stats.teamAce : stats.globalMvp;
  const performerTitle = cardId === 'best-performer-tl' ? 'TEAM LEADER' : 'MEMBER';

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden relative">
      <div style={{ 
        transform: `translate(-50%, -50%) scale(${dimensions.scale})`, 
        transformOrigin: 'center center',
        width: width,
        height: height,
        position: 'absolute',
        top: '50%',
        left: '50%',
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
      }}>
        <Stage 
          width={width} 
          height={height} 
          ref={internalStageRef}
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
          {/* 3. Snapshot Card - Podium Elite Arena */}
          {isSnapshot && (
            <Group>
               <Group x={width / 2} y={height * 0.36}>
                 {/* Arena Glow */}
                 <Circle 
                   radius={400} 
                   fillRadialGradientStartPoint={{x:0, y:0}} 
                   fillRadialGradientStartRadius={0} 
                   fillRadialGradientEndPoint={{x:0, y:0}} 
                   fillRadialGradientEndRadius={400} 
                   fillRadialGradientColorStops={[0, resolvedColor, 1, 'transparent']} 
                   opacity={0.15}
                 />

                 {/* Podium Bars (2-1-3 order) */}
                 <Group y={250}>
                    {/* Position 2 (Silver) */}
                    <Group x={-260} y={50}>
                        <Rect 
                          width={220} 
                          height={180} 
                          offsetX={110} 
                          fillLinearGradientStartPoint={{x:0, y:0}}
                          fillLinearGradientEndPoint={{x:0, y:180}}
                          fillLinearGradientColorStops={[0, '#E0E0E0', 1, '#9E9E9E']}
                          cornerRadius={20}
                          shadowBlur={50}
                          shadowColor="black"
                          shadowOpacity={0.3}
                        />
                        <Text text="2" x={-110} y={40} width={220} align="center" fontSize={100} fontStyle="900" fill="rgba(0,0,0,0.1)" />
                        <Text text={topPerformers[0]?.name?.split(' ')[0].toUpperCase() || 'P2'} x={-110} y={-80} width={220} align="center" fontSize={24} fontStyle="900" fill="white" opacity={0.6} letterSpacing={4} />
                        <Text text={topPerformers[0]?.score?.toString() || '0'} x={-110} y={-40} width={220} align="center" fontSize={40} fontStyle="900" fill="white" />
                        <Circle radius={45} y={-160} fill="#E0E0E0" opacity={0.2} />
                        <Text text={topPerformers[0]?.name?.charAt(0) || 'P'} x={-45} y={-190} width={90} align="center" fontSize={50} fontStyle="900" fill="white" />
                    </Group>

                    {/* Position 1 (Gold) */}
                    <Group x={0} y={-40}>
                        <Rect 
                          width={260} 
                          height={270} 
                          offsetX={130} 
                          fillLinearGradientStartPoint={{x:0, y:0}}
                          fillLinearGradientEndPoint={{x:0, y:270}}
                          fillLinearGradientColorStops={[0, '#FFD700', 1, '#FFA500']}
                          cornerRadius={25}
                          shadowBlur={80}
                          shadowColor="#FFD700"
                          shadowOpacity={0.2}
                        />
                        <Text text="1" x={-130} y={60} width={260} align="center" fontSize={150} fontStyle="900" fill="rgba(0,0,0,0.1)" />
                        <Text text="CHAMPION" x={-130} y={200} width={260} align="center" fontSize={20} fontStyle="900" fill="black" opacity={0.4} letterSpacing={5} />
                        <Text text={topPerformers[1]?.name?.split(' ')[0].toUpperCase() || 'P1'} x={-130} y={-100} width={260} align="center" fontSize={30} fontStyle="900" fill="#FFD700" letterSpacing={4} />
                        <Text text={topPerformers[1]?.score?.toString() || '0'} x={-130} y={-50} width={260} align="center" fontSize={50} fontStyle="900" fill="white" />
                        <Circle radius={55} y={-200} fill="#FFD700" opacity={0.3} />
                        <Text text={topPerformers[1]?.name?.charAt(0) || 'P'} x={-55} y={-235} width={110} align="center" fontSize={60} fontStyle="900" fill="white" />
                    </Group>

                    {/* Position 3 (Bronze) */}
                    <Group x={260} y={90}>
                        <Rect 
                          width={220} 
                          height={140} 
                          offsetX={110} 
                          fillLinearGradientStartPoint={{x:0, y:0}}
                          fillLinearGradientEndPoint={{x:0, y:140}}
                          fillLinearGradientColorStops={[0, '#CD7F32', 1, '#8B4513']}
                          cornerRadius={20}
                          shadowBlur={40}
                          shadowColor="black"
                          shadowOpacity={0.3}
                        />
                        <Text text="3" x={-110} y={30} width={220} align="center" fontSize={80} fontStyle="900" fill="rgba(0,0,0,0.1)" />
                        <Text text={topPerformers[2]?.name?.split(' ')[0].toUpperCase() || 'P3'} x={-110} y={-80} width={220} align="center" fontSize={22} fontStyle="900" fill="white" opacity={0.5} letterSpacing={3} />
                        <Text text={topPerformers[2]?.score?.toString() || '0'} x={-110} y={-40} width={220} align="center" fontSize={36} fontStyle="900" fill="white" />
                        <Circle radius={40} y={-150} fill="#CD7F32" opacity={0.2} />
                        <Text text={topPerformers[2]?.name?.charAt(0) || 'P'} x={-40} y={-175} width={80} align="center" fontSize={45} fontStyle="900" fill="white" />
                    </Group>
                 </Group>
               </Group>
               
               <Group y={1380}>
                  <Text 
                    text={`${weekLabel} SNAPSHOT`} 
                    x={80} 
                    y={0} 
                    width={width - 160} 
                    align="center" 
                    fontSize={36} 
                    fontStyle="900" 
                    fill="#FFD700" 
                    opacity={0.9} 
                    letterSpacing={15}
                  />
                  <Text 
                    text={(stats.currentTeamName + " RECAP").toUpperCase()} 
                    x={80} 
                    y={80} 
                    width={width - 160} 
                    align="center" 
                    fontSize={100} 
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
                 x={80} 
                 y={height / 2 - 100} 
                 width={width - 160} 
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
                    x={80} 
                    y={0} 
                    width={width - 160} 
                    align="center" 
                    fontSize={36} 
                    fontStyle="900" 
                    fill="white" 
                    opacity={0.9} 
                    letterSpacing={12}
                  />
                  <Text 
                    text={stats.topTeam.name.toUpperCase()} 
                    x={80} 
                    y={80} 
                    width={width - 160} 
                    align="center" 
                    fontSize={110} 
                    fontStyle="900 italic" 
                    fill="white" 
                    lineHeight={1}
                    letterSpacing={-4}
                  />
                  
                  {/* Points Box - Pushed Lower */}
                  <Group x={width / 2 - 180} y={450}>
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

               {/* Laptop Mascot - Lower and Proportional */}
               {laptopMascot && (
                 <Image 
                   image={laptopMascot} 
                   x={width - 50} 
                   y={height - 80} 
                   width={500} 
                   height={500 * (laptopMascot.height / laptopMascot.width)} 
                   offsetX={500} 
                   offsetY={500 * (laptopMascot.height / laptopMascot.width)}
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
                x={80} 
                y={280} 
                width={width - 160} 
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
                <Group clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.arc(0, 0, 290, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}>
                  <Rect x={-300} y={-300} width={600} height={600} fill="rgba(255,255,255,0.05)" />
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
                        setPhotoPos(p => ({ 
                          ...p, 
                          x: e.target.x() + width/2, 
                          y: e.target.y() + height * 0.42 
                        }));
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
                       text={(performer?.name?.charAt(0) || performer?.avatar?.charAt(0) || "👤").toUpperCase()}
                       fontSize={360}
                       fontStyle="900"
                       fill="white"
                       x={-200}
                       y={-220}
                       width={400}
                       align="center"
                       opacity={0.15}
                    />
                  )}
                </Group>
              </Group>

              {/* Performer Details Group */}
              <Group y={height * 0.66}>
                 <Text 
                  text={weekLabel} 
                  x={80} 
                  y={-20} 
                  width={width - 160} 
                  align="center" 
                  fontSize={28} 
                  fontStyle="900" 
                  fill="white" 
                  opacity={0.4} 
                  letterSpacing={8}
                />
                <Text 
                  text={stats.currentTeamName.toUpperCase()} 
                  x={80} 
                  y={30} 
                  width={width - 160} 
                  align="center" 
                  fontSize={40} 
                  fontStyle="900" 
                  fill="#FFD700" 
                  opacity={0.9} 
                  letterSpacing={12}
                />
                <Rect x={width/2 - 200} y={90} width={400} height={2} fill="rgba(255,215,0,0.2)" />
                
                <Text 
                  text={(performer?.name?.split(' ')[0] || (cardId === 'best-performer-tl' ? "Leader" : "Member")).toUpperCase()} 
                  x={100} 
                  y={160} 
                  width={width - 200} 
                  align="center" 
                  fontSize={140} 
                  fontStyle="900 italic" 
                  fill="white" 
                  letterSpacing={-6}
                />
                
                {/* Title Line */}
                <Group y={340}>
                   <Rect x={width/2 - 400} y={0} width={800} height={2} fill="rgba(255,255,255,0.1)" />
                   <Text 
                     text={performerTitle} 
                     x={100} 
                     y={60} 
                     width={width - 200} 
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
