import Account from '../../pages/Account';
import Trade from '../../pages/Trade';

export default function MainView(props) {
  const page = props.selectedPage;
  return (
    <>
      {
        page == 'account' ? (
          <Account />
        ) : (page == 'trade') ? (
          <Trade />
        ) : (
          <div>Not a page</div>
        )
      }
      </>
  );
}
