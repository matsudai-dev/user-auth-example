FROM debian:trixie-backports

RUN apt update -y \
    && apt install -y curl npm sudo unzip vim zip sqlite3 locales \
    && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g n \
    && n 24

RUN groupadd -g 1001 dev-user \
    && useradd -m -g 1001 -u 1001 dev-user -s /bin/bash \
    && usermod -aG sudo dev-user \
    && echo "dev-user ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers.d/dev-user \
    && chmod 440 /etc/sudoers.d/dev-user

USER dev-user
RUN mkdir -p /home/dev-user/dev
WORKDIR /home/dev-user/dev

ENV BUN_INSTALL="/home/dev-user/.bun"
ENV PATH="$BUN_INSTALL/bin:${PATH}"
RUN curl -fsSL https://bun.sh/install | bash

RUN bun install -g wrangler \
    && bunx playwright install --with-deps
