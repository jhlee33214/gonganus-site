# gonganus.com 도메인을 새 사이트에 연결하기 (Namecheap)

새 사이트는 GitHub Pages에 올라가 있습니다. Namecheap에서 도메인이 GitHub Pages를 가리키도록 바꾸는 작업입니다. 10분이면 끝나고, 반영까지는 보통 10분~1시간, 길면 하루 걸립니다.

## 순서

1. https://www.namecheap.com 로그인 → 오른쪽 위 **Account** → **Domain List**
2. `gonganus.com` 오른쪽의 **Manage** 클릭
3. 위쪽 탭에서 **Advanced DNS** 클릭
4. **Host Records** 표에서 기존 레코드를 확인합니다.
   - Type이 **A Record** 또는 **CNAME Record**이고 Host가 `@` 또는 `www`인 줄은 Adobe Portfolio로 연결된 것입니다. 각 줄 오른쪽 휴지통 아이콘으로 **모두 삭제**합니다.
   - Type이 **TXT**이거나 Host가 다른 것(예: 이메일 관련 MX)은 **그대로 둡니다**.
5. **ADD NEW RECORD** 를 눌러 아래 5줄을 하나씩 추가합니다. TTL은 Automatic 그대로.

| Type | Host | Value |
|---|---|---|
| A Record | @ | 185.199.108.153 |
| A Record | @ | 185.199.109.153 |
| A Record | @ | 185.199.110.153 |
| A Record | @ | 185.199.111.153 |
| CNAME Record | www | jhlee33214.github.io. |

6. 각 줄 오른쪽 초록 체크(✓)를 눌러 저장합니다.
7. 끝입니다. 저장한 뒤 Claude에게 "DNS 바꿨어"라고 알려주시면 반영 여부와 HTTPS를 확인해드립니다.

## 확인 방법

터미널에서 아래 명령을 실행했을 때 185.199.108~111.153 네 개가 나오면 반영된 것입니다.

```bash
dig +short gonganus.com A
```

## 주의

- Adobe Portfolio 설정은 건드리지 않아도 됩니다. DNS만 바꾸면 방문자는 새 사이트를 보게 됩니다.
- 영상 페이지는 Adobe 플레이어를 쓰므로 Adobe Portfolio 구독은 당분간 유지하세요.
