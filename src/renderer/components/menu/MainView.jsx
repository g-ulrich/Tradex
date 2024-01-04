import Equites from '../../pages/Equites';
import Trade from '../../pages/Trade';
import Code from '../../pages/Code';

export default function MainView(props) {
  const page = props.selectedPage;
  return (
    <>
      {
        page == 'equites' ? (
          <Equites />
        ) : (page == 'trade') ? (
          <Trade />
        ) : (page == 'code') ? (
          <Code />
        ) : (
          <div>Not a page</div>
        )
      }
      </>
  );
}
