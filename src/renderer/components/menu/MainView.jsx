import Account from '../../pages/Account';
import Trade from '../../pages/Trade';
import Code from '../../pages/Code';

export default function MainView(props) {
  const page = props.selectedPage;
  return (
    <>
      {
        page == 'account' ? (
          <Account />
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
