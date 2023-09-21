import style from './index.module.scss';

export default
function NavMenu() {
  return <nav className={style.com}>
    <ol>
      <li>
        <span>Game</span>
      </li>
      <li>
        <span>Swap</span>
      </li>
      <li>
        <span>Finance</span>
      </li>
      <li>
        <span>News</span>
      </li>
    </ol>
  </nav>
}
