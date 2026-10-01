package com.coldcoffee.shortly.aspect;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.coldcoffee.shortly.controller..*(..))")
    public Object logController(ProceedingJoinPoint joinPoint) throws Throwable {

        String className = joinPoint.getTarget()
                .getClass()
                .getSimpleName();

        String methodName = joinPoint.getSignature()
                .getName();

        Object[] args = joinPoint.getArgs();

        logger.info("➡️ Controller: {} | Method: {} | Args: {}",
                className,
                methodName,
                args);

        long startTime = System.currentTimeMillis();

        try {

            Object result = joinPoint.proceed();

            long executionTime =
                    System.currentTimeMillis() - startTime;

            logger.info(
                    "✅ Completed: {}.{} | Time: {} ms",
                    className,
                    methodName,
                    executionTime
            );

            return result;

        } catch (Exception e) {

            logger.error(
                    "❌ Failed: {}.{} | Error: {}",
                    className,
                    methodName,
                    e.getMessage()
            );

            throw e;
        }
    }
}

