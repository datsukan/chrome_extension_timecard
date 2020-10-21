<template>
  <div class="section">
    <!-- 登録 -->
    <div class="box">
      <p class="subtitle">新規登録</p>
      <article class="message is-danger" v-if="isUpperLimit">
        <div class="message-body">
          チャット数が登録上限に達しています。<br />
          新規登録する場合は、登録済みのチャットを削除してください。
        </div>
      </article>
      <b-field label="チャット名">
        <b-input placeholder="勤怠" v-model="registerChat.name" :disabled="isUpperLimit"></b-input>
      </b-field>
      <b-field label="URL">
        <b-input
          placeholder="https://www.chatwork.com/#!rid999999999"
          v-model="registerChat.url"
          :disabled="isUpperLimit"
        ></b-input>
      </b-field>
      <b-button type="is-info" @click="register()" :disabled="isUpperLimit">登録</b-button>
      <b-button type="is-dark" outlined :disabled="isUpperLimit" @click="currentPageRegister()"
        >現在のページを登録</b-button
      >
    </div>

    <!-- 使い方ガイド -->
    <article class="message is-success">
      <div class="message-header">
        <p>利用方法</p>
      </div>
      <div class="message-body">
        拡張機能を利用したいチャットを新規登録してください。（登録上限：50チャット）<br />
        登録されたチャットは一覧にて編集および削除が行えます。<br />
        登録されたチャットが存在しない場合は、全チャットで利用可能になります。
      </div>
    </article>

    <!-- 一覧 -->
    <p class="subtitle">対象チャット一覧</p>
    <button @click="reload()" class="button is-small is-info">
      <b-icon pack="fas" icon="sync-alt"></b-icon>
      <span>最新化</span>
    </button>
    <b-table :data="sortChats" paginated per-page="10">
      <template slot-scope="props">
        <!-- id -->
        <b-table-column field="id" label="ID" width="40" numeric centered>
          {{ props.row.id }}
        </b-table-column>

        <!-- チェット名 -->
        <b-table-column field="name" label="チャット名">
          <span v-if="!props.row.is_editing">{{ props.row.name }}</span>
          <b-input v-else v-model="props.row.name"></b-input>
        </b-table-column>

        <!-- チャットURL -->
        <b-table-column field="url" label="URL">
          <span v-if="!props.row.is_editing">{{ props.row.url }}</span>
          <b-input v-else v-model="props.row.url"></b-input>
        </b-table-column>

        <!-- 編集・削除 -->
        <b-table-column centered class="action-cell">
          <button v-if="props.row.is_editing" @click="edit(props.row)" class="button is-small is-success ml-3">
            <b-icon pack="fas" icon="check"></b-icon>
          </button>
          <button v-if="props.row.is_editing" @click="editCancel(props.row.id)" class="button is-small is-danger">
            <b-icon pack="fas" icon="times"></b-icon>
          </button>
          <button
            v-if="!props.row.is_editing"
            @click="changeEditMode(props.row.id, true)"
            class="button is-small is-success ml-3"
          >
            <b-icon pack="fas" icon="edit"></b-icon>
          </button>
          <button v-if="!props.row.is_editing" @click="remove(props.row.id)" class="button is-small is-danger">
            <b-icon pack="fas" icon="minus"></b-icon>
          </button>
        </b-table-column>
      </template>

      <template slot="empty">
        <p class="has-text-centered">登録されたデータがありません</p>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'TargetList',
  data() {
    return {
      chats: [],
      registerChat: {},
      chatsLimit: 50,
    };
  },
  beforeCreate() {},
  created() {
    this.getChats();
    this.initRegisterChat();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {
    getChats() {
      chrome.storage.local.get(['chatwork_timecard_list'], result => {
        this.chats = result.chatwork_timecard_list || [];
      });
    },
    reload() {
      chrome.storage.local.get(['chatwork_timecard_list'], result => {
        this.chats = result.chatwork_timecard_list || [];

        // 成功メッセージ
        this.$buefy.toast.open({
          message: '最新化しました',
          type: 'is-success',
        });
      });
    },
    initRegisterChat() {
      this.registerChat = {
        name: '',
        url: '',
      };
    },
    validater(name, url) {
      if (name.length === 0) {
        return false;
      }
      if (url.length === 0) {
        return false;
      }

      return true;
    },
    register() {
      // 入力チェック
      if (!this.validater(this.registerChat.name, this.registerChat.url)) {
        // 入力不正メッセージ
        this.$buefy.toast.open({
          message: '登録内容を入力してください',
          type: 'is-danger',
        });
        return;
      }

      // ストレージに登録
      // 最新のデータをストレージから取得
      chrome.storage.local.get(['chatwork_timecard_list'], result => {
        let targetList = result.chatwork_timecard_list || [];
        targetList.push({
          id:
            targetList.length > 0
              ? Math.max.apply(
                  null,
                  targetList.map(function(o) {
                    return o.id;
                  })
                ) + 1
              : 1,
          name: this.registerChat.name,
          url: this.registerChat.url,
          is_editing: false,
        });

        chrome.storage.local.set({ chatwork_timecard_list: targetList }, () => {
          this.chats = targetList;

          // 初期化
          this.initRegisterChat();

          // 成功メッセージ
          this.$buefy.toast.open({
            message: 'チャットを登録しました',
            type: 'is-success',
          });
        });
      });
    },
    currentPageRegister() {
      chrome.tabs.query({ active: true, currentWindow: true }, e => {
        // 現在の表示チャット名
        const name = e[0].title.replace('Chatwork - ', '');
        // 現在の表示チャットURL
        const url = e[0].url;

        // 入力チェック
        if (!this.validater(name, url)) {
          // 入力不正メッセージ
          this.$buefy.toast.open({
            message: '登録内容を入力してください',
            type: 'is-danger',
          });
          return;
        }

        // ストレージに登録
        // 最新のデータをストレージから取得
        chrome.storage.local.get(['chatwork_timecard_list'], result => {
          let targetList = result.chatwork_timecard_list || [];
          targetList.push({
            id:
              targetList.length > 0
                ? Math.max.apply(
                    null,
                    targetList.map(function(o) {
                      return o.id;
                    })
                  ) + 1
                : 1,
            name: name,
            url: url,
            is_editing: false,
          });

          chrome.storage.local.set({ chatwork_timecard_list: targetList }, () => {
            this.chats = targetList;

            // 初期化
            this.initRegisterChat();

            // 成功メッセージ
            this.$buefy.toast.open({
              message: 'チャットを登録しました',
              type: 'is-success',
            });
          });
        });
      });
    },
    remove(id) {
      chrome.storage.local.get(['chatwork_timecard_list'], result => {
        let targetList = result.chatwork_timecard_list || [];

        if (targetList.length === 0) {
          this.$buefy.toast.open({
            message: 'チャットは既に削除されています',
            type: 'is-info',
          });
          this.getChats();
          return;
        }

        const index = targetList.findIndex(chat => chat.id === id);

        this.$buefy.dialog.confirm({
          title: 'チャットの削除',
          message: `削除しますか？<br><br><b>${targetList[index].name}<br>${targetList[index].url}</b>`,
          confirmText: '削除',
          cancelText: 'キャンセル',
          type: 'is-danger',
          onConfirm: () => {
            if (-1 < index) {
              targetList.splice(index, 1);
            }
            chrome.storage.local.set({ chatwork_timecard_list: targetList }, () => {
              this.chats = targetList;

              this.$buefy.toast.open({
                message: 'チャットを削除しました',
                type: 'is-success',
              });
            });
          },
        });
      });
    },
    edit(chatInfo) {
      // ストレージを更新
      chrome.storage.local.get(['chatwork_timecard_list'], result => {
        let targetList = result.chatwork_timecard_list || [];

        if (targetList.length === 0) {
          this.$buefy.toast.open({
            message: '選択されたチャットが既に削除されています',
            type: 'is-info',
          });
          this.getChats();
          return;
        }

        const index = targetList.findIndex(chat => chat.id === chatInfo.id);

        targetList[index] = {
          id: chatInfo.id,
          name: chatInfo.name,
          url: chatInfo.url,
          is_editing: false,
        };

        chrome.storage.local.set({ chatwork_timecard_list: targetList }, () => {
          this.chats = targetList;

          this.$buefy.toast.open({
            message: 'チャットを更新しました',
            type: 'is-success',
          });

          // 編集状態解除
          this.changeEditMode(chatInfo.id, false);
        });
      });
    },
    editCancel(id) {
      this.changeEditMode(id, false);
    },
    changeEditMode(id, status) {
      const index = this.chats.findIndex(chat => chat.id === id);
      this.$set(this.chats[index], 'is_editing', status);
    },
  },
  computed: {
    isUpperLimit() {
      return this.chats.length >= this.chatsLimit;
    },
    sortChats() {
      return this.chats.sort((a, b) => (b.id > a.id ? 1 : -1));
    },
  },
};
</script>

<style scoped>
.action-cell {
  min-width: 100px;
}
</style>
