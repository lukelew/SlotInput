/*
 * Author  Luke.Lu
 * Date  2023-02-17 16:32:44
 * LastEditors  Luke.Lu
 * LastEditTime  2023-02-21 10:22:38
 * Description
 */
import { useRoutes } from 'react-router-dom';
import SiteRoutes from './router';

function App() {
  return useRoutes(SiteRoutes);
}

export default App;
