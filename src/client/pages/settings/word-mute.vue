<template>
<div>
	<MkTab v-model:value="tab">
		<option value="soft">{{ $ts._wordMute.soft }}</option>
		<option value="hard">{{ $ts._wordMute.hard }}</option>
	</MkTab>
	<FormBase>
		<div class="_formItem">
			<div v-show="tab === 'soft'">
				<MkInfo>{{ $ts._wordMute.softDescription }}</MkInfo>
				<FormTextarea v-model:value="softMutedWords">
					<span>{{ $ts._wordMute.muteWords }}</span>
					<template #desc>{{ $ts._wordMute.muteWordsDescription }}<br>{{ $ts._wordMute.muteWordsDescription2 }}</template>
				</FormTextarea>
			</div>
			<div v-show="tab === 'hard'">
				<MkInfo>{{ $ts._wordMute.hardDescription }}</MkInfo>
				<FormTextarea v-model:value="hardMutedWords">
					<span>{{ $ts._wordMute.muteWords }}</span>
					<template #desc>{{ $ts._wordMute.muteWordsDescription }}<br>{{ $ts._wordMute.muteWordsDescription2 }}</template>
				</FormTextarea>
				<FormKeyValueView v-if="hardWordMutedNotesCount != null">
					<template #key>{{ $ts._wordMute.mutedNotes }}</template>
					<template #value>{{ number(hardWordMutedNotesCount) }}</template>
				</FormKeyValueView>
			</div>
		</div>
		<FormButton @click="save()" primary inline :disabled="!changed"><Fa :icon="faSave"/> {{ $ts.save }}</FormButton>
	</FormBase>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faCommentSlash, faSave } from '@fortawesome/free-solid-svg-icons';
import FormTextarea from '@client/components/form/textarea.vue';
import FormBase from '@client/components/form/base.vue';
import FormKeyValueView from '@client/components/form/key-value-view.vue';
import FormButton from '@client/components/form/button.vue';
import MkTab from '@client/components/tab.vue';
import MkInfo from '@client/components/ui/info.vue';
import * as os from '@client/os';
import number from '@client/filters/number';

export default defineComponent({
	components: {
		FormBase,
		FormButton,
		FormTextarea,
		FormKeyValueView,
		MkTab,
		MkInfo,
	},

	emits: ['info'],
	
	data() {
		return {
			INFO: {
				title: this.$ts.wordMute,
				icon: faCommentSlash
			},
			tab: 'soft',
			softMutedWords: '',
			hardMutedWords: '',
			hardWordMutedNotesCount: null,
			changed: false,
			faSave,
		}
	},

	watch: {
		softMutedWords: {
			handler() {
				this.changed = true;
			},
			deep: true
		},
		hardMutedWords: {
			handler() {
				this.changed = true;
			},
			deep: true
		},
	},

	async created() {
		this.softMutedWords = this.$store.state.mutedWords.map(x => x.join(' ')).join('\n');
		this.hardMutedWords = this.$i.mutedWords.map(x => x.join(' ')).join('\n');

		this.hardWordMutedNotesCount = (await os.api('i/get-word-muted-notes-count', {})).count;
	},

	mounted() {
		this.$emit('info', this.INFO);
	},

	methods: {
		async save() {
			this.$store.set('mutedWords', this.softMutedWords.trim().split('\n').map(x => x.trim().split(' ')));
			await os.api('i/update', {
				mutedWords: this.hardMutedWords.trim().split('\n').map(x => x.trim().split(' ')),
			});
			this.changed = false;
		},

		number
	}
});
</script>
