import { useNavigate } from 'react-router-dom';

const DuckCard = ({
  id,
  duck_name,
  img_src,
  owner: { first_name, last_name },
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/duck/${id}`)}
      className='card w-96 bg-gray-900 h-[32rem] hover:scale-[1.02] hover:cursor-pointer transition-all'
    >
      <figure className='h-[70%] overflow-hidden'>
        <img src={img_src} alt='A rubber duck' className='object-cover' />
      </figure>
      <div className='card-body gap-6 text-center'>
        <h2 className='card-title'>
          My name is {duck_name}! Do you need my help with debugging?
        </h2>
        <p>
          I am one of {first_name} {last_name}&apos;s trusty confidantes.
        </p>
      </div>
    </div>
  );
};

export default DuckCard;
