import style from './index.module.scss';

export default
function NavMenu() {
  return <nav className={style.com}>
    <ol>
      <li>
        <a href="https://www.google.com/">Game</a>
      </li>
      <li>
        <a href="https://www.google.com/">Swap</a>
      </li>
      <li>
        <a href="https://www.google.com/">Finance</a>
      </li>
      <li>
        <a href="https://www.google.com/">News</a>
      </li>
    </ol>
  </nav>
}
