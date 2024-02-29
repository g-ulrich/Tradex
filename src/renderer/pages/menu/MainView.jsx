import Equites from '../Equities/Equites';
import Code from '../Code';

export default function MainView(props) {
  const page = props.selectedPage;
  return (
    <>
      {
        page == 'equites' ? (
          <Equites />
        ) : (page == 'code') ? (
          <Code />
        ) : (
          <div>Not a page</div>
        )
      }
      </>
  );
}
