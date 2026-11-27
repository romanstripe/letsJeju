// 공공누리(TourAPI) 사진은 자르지 않는다
export const isWholePhoto = (url) => Boolean(url?.includes('visitkorea'));

// 작은 사진 칸. 사진이 없으면 빈 칸.
export default function Thumb({ photo, className = '', children }) {
  return (
    <span className={`thumb ${className}`}>
      {photo && <img className={isWholePhoto(photo) ? 'is-whole' : undefined} src={photo} alt="" loading="lazy" />}
      {children}
    </span>
  );
}
