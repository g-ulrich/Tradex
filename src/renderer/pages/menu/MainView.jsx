import Equites from '../Equities/Equites';
import Trade from '../Trade';
import Code from '../Code';

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
