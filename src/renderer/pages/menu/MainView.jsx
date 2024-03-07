import Equites from '../Equities/Equites';
import LiveTrade from '../LiveTrade/livetrade';
import Code from '../Code';

export default function MainView(props) {
  const page = props.selectedPage;
  return (
    <>
      {
        page == 'equites' ? (
          <Equites />
        ) : (page == 'liveTrade') ? (
          <LiveTrade />
        ) : (page == 'code') ? (
          <Code />
        ) : (
          <div>Not a page</div>
        )
      }
      </>
  );
}
