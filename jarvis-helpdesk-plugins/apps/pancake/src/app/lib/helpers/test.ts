import { PancakeAPIs } from '../../apis/pancake-apis';

import { getElementValue, setElementValue } from './dom-interaction';

const onActionClickTest: () => Promise<void> = async () => {
  console.log('getListPages: ', await PancakeAPIs.getListPages());
  console.log('getDomain: ', await PancakeAPIs.getDomain());
  console.log('generatePageAccessToken: ', await PancakeAPIs.generatePageAccessToken());
  console.log('getConversations: ', await PancakeAPIs.getConversations());
  console.log(
    'getMessages: ',
    await PancakeAPIs.getMessages('web_NTKay11_web_MzJlMWQ0ZjItOTNiMy00ODMxLTk0YTYtYmYwMTAyYzZjMTdj')
  );

  const value = await getElementValue('#replyBoxComposer');
  alert('Value: ' + value);
  await setElementValue('#replyBoxComposer', 'hello world');
};

export default onActionClickTest;
