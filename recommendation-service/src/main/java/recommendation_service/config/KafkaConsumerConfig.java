package recommendation_service.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import recommendation_service.event.RatingEvent;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, RatingEvent> consumerFactory() {

        JsonDeserializer<RatingEvent> deserializer = new JsonDeserializer<>(RatingEvent.class);

        deserializer.addTrustedPackages(
                "recommendation_service.event"
        );

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "recommendation-service"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        config.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class
        );

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RatingEvent>
    kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, RatingEvent>
              factory = new ConcurrentKafkaListenerContainerFactory<>();

              factory.setConsumerFactory(consumerFactory());

        return factory;
    }
}
