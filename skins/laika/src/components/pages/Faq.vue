<template>
	<div id="faq">
		<h1 class="title is-size-1">{{ $t('page_title') }}</h1>
		<ul>
			<li v-for="( topic, index ) in content.topics"
				:key="index">
				<h2 class="title is-size-2 has-margin-top-36 has-margin-bottom-18">{{ topic.name }}</h2>
				<question
						v-for="(content, index) in getQuestionsByTopic(topic)"
						v-on:question-opened="setOpenQuestionId( $event )"
						:content="content"
						:key="topic.id+index"
						:visible-question-id="openQuestionId"
						:question-id="topic.id+index.toString()">
				</question>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Question from '@/components/pages/frequently_asked_questions/Question.vue';
import { FaqContent, Topic, FaqData, QuestionModel } from '@/view_models/faq';

export default Vue.extend( {
	name: 'faq',
	components: {
		Question,
	},
	props: {
		content: {
			type: Object as () => FaqContent,
		},
	},
	data: function (): FaqData {
		return {
			openQuestionId: '',
		};
	},
	methods: {
		setOpenQuestionId: function ( id: string ): void {
			this.openQuestionId = id;
		},

		getQuestionsByTopic: function ( topic: Topic ): QuestionModel[] {
			return this.content.questions.filter( question => question.topic.split( ',' ).indexOf( topic.id ) !== -1 );
		},
	},
} );
</script>
